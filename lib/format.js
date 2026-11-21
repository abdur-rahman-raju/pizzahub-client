export const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

export const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });


export const formatDeliveryDate = (value) => formatDate(`${value}T00:00:00`);