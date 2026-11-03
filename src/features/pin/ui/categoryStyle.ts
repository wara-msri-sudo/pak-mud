import { PIN_CATEGORIES, type PinCategory } from "../domain/pin";

/** Written out in full so Tailwind generates each class (decision 0005 tokens). */
export const CATEGORY_DOT_CLASS: Record<PinCategory, string> = {
  food: "bg-cat-food",
  temple: "bg-cat-temple",
  nature: "bg-cat-nature",
  shopping: "bg-cat-shopping",
  nightlife: "bg-cat-nightlife",
  stay: "bg-cat-stay",
};

export function categoryLabel(category: PinCategory): string {
  return PIN_CATEGORIES.find((entry) => entry.id === category)?.label ?? category;
}
