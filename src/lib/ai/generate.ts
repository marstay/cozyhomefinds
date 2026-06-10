export type GenerateField =
  | "product-description"
  | "product-features"
  | "product-tags"
  | "product-badge"
  | "product-title"
  | "blog-excerpt"
  | "blog-content"
  | "blog-tags";

export interface GenerateContext {
  title?: string;
  asin?: string;
  description?: string;
  features?: string;
  tags?: string;
  price?: string;
  excerpt?: string;
  content?: string;
}

const SITE_CONTEXT =
  "Cozy Home Finds is a curated Amazon affiliate store for home decor. Tone: warm, inviting, editorial, trustworthy. Never mention competitors. Do not invent specs or prices.";

function buildPrompt(field: GenerateField, context: GenerateContext): string {
  const base = [
    context.title && `Product/post title: ${context.title}`,
    context.asin && `ASIN: ${context.asin}`,
    context.price && `Price: $${context.price}`,
    context.description && `Existing description: ${context.description}`,
    context.features && `Existing features: ${context.features}`,
    context.tags && `Existing tags: ${context.tags}`,
    context.excerpt && `Existing excerpt: ${context.excerpt}`,
  ]
    .filter(Boolean)
    .join("\n");

  const prompts: Record<GenerateField, string> = {
    "product-description": `${SITE_CONTEXT}

Write a compelling product description (2-4 sentences) for a home decor affiliate product page.
Focus on how it improves the room, texture, style, and cozy feel.
${base}

Return ONLY the description text, no quotes or labels.`,

    "product-features": `${SITE_CONTEXT}

Write 4-6 short bullet-point feature highlights for this home decor product.
Each bullet should be one concise line, buyer-focused, no numbering.
${base}

Return ONLY the bullet points, one per line.`,

    "product-tags": `${SITE_CONTEXT}

Suggest 3-5 lowercase tags for organizing this product (e.g. living-room, textiles, neutral).
${base}

Return ONLY comma-separated tags, no spaces after commas unless part of tag like "wall-art".`,

    "product-badge": `${SITE_CONTEXT}

Suggest ONE short badge label for this product (2-3 words max, e.g. "Editor's Pick", "Best Seller", "Cozy Essential").
${base}

Return ONLY the badge text, nothing else.`,

    "product-title": `${SITE_CONTEXT}

Rewrite this Amazon product title to be cleaner and more appealing for a curated home decor store.
Keep it accurate — do not add features that aren't implied.
${base}

Return ONLY the rewritten title, under 120 characters.`,

    "blog-excerpt": `${SITE_CONTEXT}

Write a 1-2 sentence blog excerpt for SEO and social cards.
${base}

Return ONLY the excerpt, under 160 characters.`,

    "blog-content": `${SITE_CONTEXT}

Write a helpful home decor blog article in Markdown format.
Include: intro, 3-5 sections with ## headings, practical tips, and a brief conclusion.
Keep it 400-600 words. Affiliate-friendly but not salesy.
${base}

Return ONLY the Markdown content.`,

    "blog-tags": `${SITE_CONTEXT}

Suggest 3-4 lowercase blog tags (e.g. living-room, budget, tips).
${base}

Return ONLY comma-separated tags.`,
  };

  return prompts[field];
}

export function isAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function generateFieldContent(
  field: GenerateField,
  context: GenerateContext,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OpenAI API key not configured. Add OPENAI_API_KEY to .env.local",
    );
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a home decor copywriter for an Amazon affiliate store. Be concise and accurate.",
        },
        {
          role: "user",
          content: buildPrompt(field, context),
        },
      ],
      temperature: 0.7,
      max_tokens: field === "blog-content" ? 1200 : 400,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${err.slice(0, 200)}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("No content returned from OpenAI");
  }

  return content;
}

export async function generateProductFields(
  fields: GenerateField[],
  context: GenerateContext,
): Promise<Partial<Record<GenerateField, string>>> {
  const results: Partial<Record<GenerateField, string>> = {};

  for (const field of fields) {
    results[field] = await generateFieldContent(field, context);
  }

  return results;
}
