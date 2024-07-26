const form = document.querySelector("form"),
    fileInput = document.querySelector(".file-input"),
    progressArea = document.querySelector(".progress-area"),
    uploadedArea = document.querySelector(".uploaded-area"),
    clickableArea = document.querySelector(".clickable"),
    merge = document.querySelector(".merge");

let selectedFiles = [];

clickableArea.addEventListener("click", (event) => {
    fileInput.click();
});

fileInput.onchange = ({ target }) => {
    selectedFiles = Array.from(target.files);
    displaySelectedFiles();
};

function displaySelectedFiles() {
    uploadedArea.innerHTML = "";
    selectedFiles.forEach(file => {
        let fileName = file.name;
        if (fileName.length >= 12) {
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
        }
        let fileSize = file.size < 1024000
            ? (file.size / 1024).toFixed(2) + " KB"
            : (file.size / (1024 * 1024)).toFixed(2) + " MB";

        let fileHTML = `<li class="row">
            <div class="content upload">
                <i class="fas fa-file-alt"></i>
                <div class="details">
                    <span class="name">${fileName} • Selected</span>
                    <span class="size">${fileSize}</span>
                </div>
            </div>
            <i class="fas fa-check"></i>
        </li>`;
        uploadedArea.insertAdjacentHTML("afterbegin", fileHTML);
    });
}

merge.addEventListener("click", () => {
    if (selectedFiles.length === 0) {
        alert("Please select files before merging.");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/upload");

    xhr.upload.addEventListener("progress", ({ loaded, total }) => {
        let fileLoaded = Math.floor((loaded / total) * 100);
        progressArea.innerHTML = `<div class="progress-bar">
            <div class="progress" style="width: ${fileLoaded}%"></div>
        </div>
        <span class="percent">${fileLoaded}%</span>`;
    });

    xhr.onload = function () {
        if (xhr.status === 200) {
            progressArea.innerHTML = "";
            alert("Files uploaded and merged successfully!");
        } else {
            alert("Upload failed. Please try again.");
        }
    };

    let formData = new FormData();
    selectedFiles.forEach(file => {
        formData.append("pdfs", file);
    });
    xhr.send(formData);
});
