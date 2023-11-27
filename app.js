



const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');


// Function to fetch all products from the server
async function fetchProducts() {
  const response = await fetch('18.230.194.98:3000/products');
  const products = await response.json();

  // Clear product list
  productList.innerHTML = '';

  // Add each product to the list
  products.forEach(product => {
    const li = document.createElement('li');
    li.style.whiteSpace = 'pre-wrap';
    li.innerHTML = `${product.name} : <strong>$${product.price}</strong>`;

    // Add delete button for each product
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Add update button for each product
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', () => {
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductPrice.value = product.price;
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });

    document.getElementById('updateForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const id = parseInt(document.getElementById('update-id').value);
    const name = document.getElementById('update-name').value;
    const price = parseInt(document.getElementById('update-price').value);
    const updateDate = {name : name, price : price}
  
    await updateProduct(id, updateDate);
    await fetchProducts();
  });
}


// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  await addProduct(name, price);
  addProductForm.reset();
  await fetchProducts();
});

// Function to add a new product
async function addProduct(name, price) {
  const response = await fetch('18.230.194.98/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price })
  });
  window.location.reload();
  return response.json();
}

// Function to delete a new product
async function deleteProduct(id) {
  const response = await fetch('18.230.194.98/products/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    //body: JSON.stringify({id})
  });
  window.location.reload();
  return response.json();
}

// Function Update
async function updateProduct(id, data) {
  try{
  const response = await fetch("18.230.194.98/products/"+id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Erro ao atualizar produto.');
  }

  const result = await response.json();
  console.log(result); // Pode ser útil verificar a resposta do servidor

  window.location.reload();
  return result;

} catch (error) {
  console.error('Erro durante a atualização:', error.message);
}
}

// Fetch all products on page load
fetchProducts();