import { JSDOM } from "jsdom";

export const fetchHtml = async (url: string): Promise<string | void> => {
  try {
    const response = await fetch(url);
    if (
      !response.ok ||
      !response.headers.get("content-type")?.includes("text/html")
    ) {
      return;
    }

    const body = await response.text();

    return body.includes("<html") ? body : undefined;
  } catch (error) {
    console.log(error);
  }
};

export function cleanHtml(inputHTML: string) {
  // Parse the HTML using jsdom
  const dom = new JSDOM(inputHTML);
  const document = dom.window.document;

  // Function to recursively extract text content and clean images
  const extractContent = (node: Node) => {
    let output = "";

    // If the node is an element
    if (node.nodeType === 1) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      if (tagName === "img") {
        // Handle <img> tags: keep src and alt attributes
        const src = element.getAttribute("src") || "";
        const alt = element.getAttribute("alt") || "";
        output += `<img ${src ? `src="${src}"` : ""} ${
          alt ? `alt="${alt}"` : ""
        }>`;
      } else if (tagName !== "script" && tagName !== "style") {
        // Process child nodes for non-script/style elements
        Array.from(node.childNodes).forEach((child) => {
          output += " " + extractContent(child);
        });
      }
    } else if (node.nodeType === 3) {
      // If the node is a text node, add its content
      output += node.textContent?.trim() ?? "";
    }

    return output;
  };

  // Start extraction from the document body
  const cleanedContent = extractContent(document.body);

  // Collapse multiple spaces and return the result
  return cleanedContent.replace(/\s+/g, " ").trim();
}
