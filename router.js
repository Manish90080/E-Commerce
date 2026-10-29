export const currentRoute = () => {
  const [path, query = ""] = window.location.hash.slice(1).split("?");
  const parts = (path || "/").split("/").filter(Boolean);

  if (parts.length === 0) return { name: "home" };
  if (parts[0] === "shop") return { name: "shop", search: new URLSearchParams(query).get("q") || "" };
  if (parts[0] === "category" && parts[1]) return { name: "category", category: parts[1] };
  if (parts[0] === "product" && parts[1]) return { name: "product", id: parts[1] };
  if (parts[0] === "cart") return { name: "cart" };
  return { name: "not-found" };
};

export const navigate = (path) => {
  window.location.hash = path;
};
