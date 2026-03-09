/* ==================================================
   API ADAPTER – AiShopper Frontend
================================================== */

/**
 * IMPORTANT FOR BACKEND / API DEVELOPER
 *
 * Implement ONLY this function.
 * Do NOT change any frontend files.
 *
 * This function MUST return an array of products
 * in the following format:
 *
 * {
 *   id: number | string,
 *   title: string,
 *   price: number,          // price in INR
 *   category: string,
 *   image: string,          // direct image URL
 *   rating?: number
 * }
 */

export async function getAllProducts() {
  /*
    🔴 IMPLEMENT API LOGIC HERE 🔴

    Example (replace with your API):

    const res = await fetch("YOUR_API_URL");
    const data = await res.json();

    return data.map(item => ({
      id: item.id,
      title: item.name,
      price: item.price,
      category: item.category,
      image: item.imageUrl,
      rating: item.rating
    }));
  */

  console.warn(
    "getAllProducts() is not implemented. Backend dev must add API logic."
  );

  return [];
}
