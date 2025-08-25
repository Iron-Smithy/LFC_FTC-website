const API_KEY = "AIzaSyCYGFNJRuC_2QzNt8wLH81eqpImb5QQuiU"; // api key
    const FOLDER_ID = "1BJeOeFFEpNbxjPC6se5Mf1-2p5rI5jUE"; // folder

    async function fetchImages() {
        const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType,createdTime)`;
        const res = await fetch(url);
        const data = await res.json();

        const gallery = document.getElementById("gallery");
        gallery.innerHTML = "";

        (data.files || []).forEach(file => {
            if (file.mimeType.startsWith("image/")) {
                const img = document.createElement("img");
                img.src = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${API_KEY}`;
                img.alt = file.name;

                const div = document.createElement("div");
                div.className = "gallery-item";
                div.appendChild(img);

                gallery.appendChild(div);
            }
        });
    }

    fetchImages();