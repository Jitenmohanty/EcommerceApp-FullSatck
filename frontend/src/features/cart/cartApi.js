
export function addToCart(item) {
  return new Promise(async (resolve) => {
    const response = await fetch("/cart", {
      method: "POST",
      body: JSON.stringify(item),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}
export function fetchItemByUserId() {
  return new Promise(async (resolve) => {
    const response = await fetch("/cart");
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}
export function updateItemById(update) {
  return new Promise(async (resolve) => {
    const response = await fetch('/cart/' + update.id, {
      method: 'PATCH',
      body: JSON.stringify(update),
      headers: { 'content-type': 'application/json' },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}

export function removeItemFromCart(ItemId) {
  return new Promise(async (resolve) => {
    const response = await fetch("/cart/" + ItemId,{
      method:"DELETE",
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data:{id:ItemId} });
  });
}
export function resetCart() {
  return new Promise(async (resolve) => {
    const response = await fetchItemByUserId()
    const items = response.data;

    for(let item of items){
      await removeItemFromCart(item.id);
    }
    resolve({status:"Cart now empty"})
  });
}