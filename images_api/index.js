function fetchImages() {
  fetch("http://127.0.0.1:8000/api/images")
    .then((response) => response.json())
    .then((data) => {
      const outputDiv = document.getElementById("output");
      outputDiv.innerHTML = ""; // Clear previous content

      data.data.forEach((image) => {
        outputDiv.innerHTML += `
                    <div style="border: 1px solid #ccc; padding: 10px; margin: 10px; text-align: center;">
                        <p>ID: ${image.id}</p>
                        <img src="http://127.0.0.1:8000/storage/${
                          image.image_path
                        }" 
                        alt="Fetched Image" 
                        style="width: 200px; display: block; margin: auto;">
                        <p>Created_at: ${new Date(
                          image.created_at
                        ).toLocaleDateString()}</p>
                        <p>Image_path: ${image.image_path}</p>
                         <input type="file" id="imageInput-${image.id}" />
                        <button onclick="updateImage(${image.id})">Update </button>
                        <button onclick="deleteImage(${image.id})">Delete </button>
                    </div>
                `;
      });
    })
    .catch((error) => console.error("Error fetching images:", error));
}

// Upload Image
function uploadImage() {
  const fileInput = document.getElementById("imageInput");
  const formData = new FormData();
  formData.append("image_path", fileInput.files[0]);

  fetch("http://127.0.0.1:8000/api/images", {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json"
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert("Image uploaded successfully!");
        fetchImages();
      } else {
        alert("Upload failed: " + JSON.stringify(data));
      }
    })
    .catch((error) => console.error("Error uploading image:", error));
}



// Update Image
function updateImage(id) {
    console.log("Updating Image ID:", id);

    
    const fileInput = document.getElementById(`imageInput-${id}`);
    
    if (!fileInput || !fileInput.files.length) {
        alert("Please select an image before updating.");
        return;
    }

    const formData = new FormData();
    formData.append("image_path", fileInput.files[0]);
    formData.append("_method", "PUT");
    fetch(`http://127.0.0.1:8000/api/images/${id}`, {
        method: "POST", 
        headers: {
            "Accept": "application/json"
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert("Image updated successfully!");
            fetchImages();
        } else {
            alert("Update failed: " + JSON.stringify(data));
        }
    })
    .catch(error => console.error("Error updating image:", error));
}


// Delete Image
function deleteImage(id) {
    console.log("Delete Image id:", id);
    if(!confirm("Are you sure you want to delete this image!"))return;
    fetch(`http://127.0.0.1:8000/api/images/${id}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            
            
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert("Image deleted successfully!");
            fetchImages();
        } else {
            alert("Delete failed: " + JSON.stringify(data));
        }
    })
    .catch(error => console.error("Error deleting image:", error));
}
