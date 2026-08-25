function changeLanguage() {
  const languageSelector = document.getElementById('language-selector');
  localStorage.setItem("lang", languageSelector.value);
  translate();
}

async function populateLanguages() {
    const selectedLang = localStorage.getItem("lang") || "en";
    try {
        const res = await fetch(`lang/langs.json`);
        const json = await res.json();
        const languageSelector = document.getElementById('language-selector');
        
        for ( const lang in json ){
            const option = document.createElement("option")
            option.value = json[lang].code
            option.innerText = json[lang].name
            if(selectedLang == json[lang].code) option.selected = true
            languageSelector.appendChild(option)
        }
    } catch (err) {
        console.error("Error cargando traducciones:", err);
    }
}

async function translate() {
  const lang = localStorage.getItem("lang") || "en";
  const languageSelector = document.getElementById('language-selector');
  languageSelector.value = lang;

  try {
    const res = await fetch(`lang/${lang}.json`);
    const json = await res.json();

    // Buscar todos los elementos con data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (json[key]) {
        el.textContent = json[key];
      }
    });
  } catch (err) {
    console.error("Error cargando traducciones:", err);
  }
}

// Ejecutar al cargar
populateLanguages();
translate();