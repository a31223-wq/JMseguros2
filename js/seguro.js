/* /js/seguro.js
   Validações + submit handler (static friendly)
*/

(() => {
  // Se quiseres enviar para backend (Libax / webhook / etc), mete aqui:
  // Ex: "https://teu-backend.com/api/lead"
  const API_ENDPOINT = ""; // vazio = não faz fetch

  const form = document.getElementById("autoQuoteForm");
  if (!form) return;

  const statusEl = document.getElementById("formStatus");

  // Helpers
  const byId = (id) => document.getElementById(id);
  const trim = (s) => (s || "").trim();

  const showStatus = (msg, type = "") => {
    if (!statusEl) return;
    statusEl.className = "form-status" + (type ? ` ${type}` : "");
    statusEl.textContent = msg || "";
  };

  const setError = (fieldId, message = "") => {
    const field = byId(fieldId);
    const err = document.querySelector(`[data-error-for="${fieldId}"]`);

    if (field) field.classList.toggle("error", !!message);
    if (err) {
      err.textContent = message;
      err.classList.toggle("show", !!message);
    }
  };

  const clearAllErrors = () => {
    form.querySelectorAll(".q-error").forEach((e) => {
      e.textContent = "";
      e.classList.remove("show");
    });
    form.querySelectorAll(".error").forEach((e) => e.classList.remove("error"));
  };

  const parseDate = (value) => {
    if (!value) return null;
    const d = new Date(value + "T00:00:00");
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const today = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const isPastDate = (value) => {
    const d = parseDate(value);
    if (!d) return false;
    return d.getTime() < today().getTime();
  };

  const isTodayOrFuture = (value) => {
    const d = parseDate(value);
    if (!d) return false;
    return d.getTime() >= today().getTime();
  };

  const isEmailValid = (email) => {
    // simples e robusto
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  };

  const onlyDigits = (s) => (s || "").replace(/\D+/g, "");

  const isPhonePTValid = (phone) => {
    const p = onlyDigits(phone);
    // regra simples: 9 dígitos e começa por 9 (telemóvel)
    return /^9\d{8}$/.test(p);
  };

  const isPostalPTValid = (cp) => {
    const v = trim(cp);
    return /^\d{4}-\d{3}$/.test(v);
  };

  // NIF checksum (validação estrutural)
  // NOTA: isto não confirma se existe nas Finanças, só valida o dígito de controlo.
  const isNIFValid = (nif) => {
    const n = onlyDigits(nif);
    if (!/^\d{9}$/.test(n)) return false;

    // Em PT, o primeiro dígito pode ser 1,2,3,5,6,8,9 (e alguns outros em casos específicos).
    // Para não bloquear casos raros, validamos sobretudo o checksum.
    const digits = n.split("").map((x) => parseInt(x, 10));
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += digits[i] * (9 - i);
    const mod11 = sum % 11;
    const check = mod11 < 2 ? 0 : 11 - mod11;
    return digits[8] === check;
  };

  // Matrículas PT comuns:
  // - AA-00-AA (novo)
  // - 00-AA-00
  // - AA-00-00
  // - 00-00-AA
  // Aceita com ou sem hífens/espaços
  const isMatriculaPTValid = (m) => {
    const raw = trim(m).toUpperCase().replace(/\s+/g, "");
    const normalized = raw.replace(/-/g, "");
    if (!/^[A-Z0-9]{6}$/.test(normalized)) return false;

    const a = "[A-Z]{2}";
    const d = "\\d{2}";
    const patterns = [
      new RegExp(`^${a}${d}${a}$`), // AA00AA
      new RegExp(`^${d}${a}${d}$`), // 00AA00
      new RegExp(`^${a}${d}${d}$`), // AA0000
      new RegExp(`^${d}${d}${a}$`), // 0000AA
    ];
    return patterns.some((p) => p.test(normalized));
  };

  const isMinWords = (text, minWords = 2) => {
    const parts = trim(text).split(/\s+/).filter(Boolean);
    return parts.length >= minWords;
  };

  const getFormDataObject = () => {
    const fd = new FormData(form);
    const obj = {};
    fd.forEach((value, key) => (obj[key] = String(value)));
    // normalizações úteis
    obj.nif = onlyDigits(obj.nif);
    obj.telemovel = onlyDigits(obj.telemovel);
    obj.matricula = trim(obj.matricula).toUpperCase();
    return obj;
  };

  const validate = () => {
    clearAllErrors();
    showStatus("");

    const nome = trim(byId("nome")?.value);
    const morada = trim(byId("morada")?.value);
    const codigo_postal = trim(byId("codigo_postal")?.value);
    const localidade = trim(byId("localidade")?.value);
    const nif = trim(byId("nif")?.value);
    const telemovel = trim(byId("telemovel")?.value);
    const email = trim(byId("email")?.value);
    const data_nascimento = trim(byId("data_nascimento")?.value);

    const matricula = trim(byId("matricula")?.value);
    const data_matricula = trim(byId("data_matricula")?.value);
    const lugares = trim(byId("lugares")?.value);
    const marca = trim(byId("marca")?.value);
    const modelo = trim(byId("modelo")?.value);
    const cilindrada = trim(byId("cilindrada")?.value);
    const peso_bruto = trim(byId("peso_bruto")?.value);

    const data_carta = trim(byId("data_carta")?.value);
    const inicio_seguro = trim(byId("inicio_seguro")?.value);

    let ok = true;

    // Obrigatórios simples
    if (!nome) { setError("nome", "Preenchimento obrigatório."); ok = false; }
    else if (!isMinWords(nome, 2)) { setError("nome", "Indique pelo menos nome e apelido."); ok = false; }

    if (!morada) { setError("morada", "Preenchimento obrigatório."); ok = false; }

    if (!codigo_postal) { setError("codigo_postal", "Preenchimento obrigatório."); ok = false; }
    else if (!isPostalPTValid(codigo_postal)) { setError("codigo_postal", "Código postal inválido (ex: 1234-567)."); ok = false; }

    if (!localidade) { setError("localidade", "Preenchimento obrigatório."); ok = false; }

    if (!nif) { setError("nif", "Preenchimento obrigatório."); ok = false; }
    else if (!isNIFValid(nif)) { setError("nif", "NIF inválido (dígito de controlo)."); ok = false; }

    if (!telemovel) { setError("telemovel", "Preenchimento obrigatório."); ok = false; }
    else if (!isPhonePTValid(telemovel)) { setError("telemovel", "Telemóvel inválido (9 dígitos, começa por 9)."); ok = false; }

    if (!email) { setError("email", "Preenchimento obrigatório."); ok = false; }
    else if (!isEmailValid(email)) { setError("email", "Email inválido."); ok = false; }

    if (!data_nascimento) { setError("data_nascimento", "Preenchimento obrigatório."); ok = false; }
    else if (!isPastDate(data_nascimento)) { setError("data_nascimento", "A data de nascimento tem de ser no passado."); ok = false; }

    // Veículo
    if (!matricula) { setError("matricula", "Preenchimento obrigatório."); ok = false; }
    else if (!isMatriculaPTValid(matricula)) { setError("matricula", "Matrícula inválida (formatos PT comuns)."); ok = false; }

    if (!data_matricula) { setError("data_matricula", "Preenchimento obrigatório."); ok = false; }
    else if (!isPastDate(data_matricula)) { setError("data_matricula", "A data da matrícula tem de ser no passado."); ok = false; }

    if (!lugares) { setError("lugares", "Preenchimento obrigatório."); ok = false; }
    else if (!(Number(lugares) >= 1 && Number(lugares) <= 99)) { setError("lugares", "Número inválido."); ok = false; }

    if (!marca) { setError("marca", "Preenchimento obrigatório."); ok = false; }
    if (!modelo) { setError("modelo", "Preenchimento obrigatório."); ok = false; }

    if (!cilindrada) { setError("cilindrada", "Preenchimento obrigatório."); ok = false; }
    else if (!(Number(cilindrada) > 0)) { setError("cilindrada", "Valor inválido."); ok = false; }

    if (!peso_bruto) { setError("peso_bruto", "Preenchimento obrigatório."); ok = false; }
    else if (!(Number(peso_bruto) > 0)) { setError("peso_bruto", "Valor inválido."); ok = false; }

    // Perguntas (datas)
    if (!data_carta) { setError("data_carta", "Preenchimento obrigatório."); ok = false; }
    else if (!isPastDate(data_carta)) { setError("data_carta", "A data da carta tem de ser no passado."); ok = false; }

    if (!inicio_seguro) { setError("inicio_seguro", "Preenchimento obrigatório."); ok = false; }
    else if (!isTodayOrFuture(inicio_seguro)) { setError("inicio_seguro", "A data de início deve ser hoje ou no futuro."); ok = false; }

    // Regras cruzadas (soft, mas úteis)
    const dn = parseDate(data_nascimento);
    const dc = parseDate(data_carta);
    if (dn && dc) {
      // carta não pode ser antes de nascer
      if (dc.getTime() <= dn.getTime()) {
        setError("data_carta", "A data da carta não pode ser anterior à data de nascimento.");
        ok = false;
      } else {
        // opcional: pelo menos 16 anos depois (aprox)
        const minCarta = new Date(dn);
        minCarta.setFullYear(minCarta.getFullYear() + 16);
        if (dc.getTime() < minCarta.getTime()) {
          setError("data_carta", "Data da carta parece muito cedo (verifique).");
          ok = false;
        }
      }
    }

    return ok;
  };

  const attachRealtimeValidation = () => {
    const realtimeIds = [
      "nome","morada","codigo_postal","localidade","nif","telemovel","email","data_nascimento",
      "matricula","data_matricula","lugares","marca","modelo","versao","cilindrada","peso_bruto",
      "data_carta","inicio_seguro","uso_ocasional","direitos_ressalvados","atrelado_ate_300","obs"
    ];

    realtimeIds.forEach((id) => {
      const el = byId(id);
      if (!el) return;

      const evt = (el.tagName === "SELECT" || el.type === "date") ? "change" : "input";
      el.addEventListener(evt, () => {
        // valida só o campo (básico) para não ser chato
        // (mantemos simples; validação completa é no submit)
        const v = trim(el.value);

        if (id === "nome") setError(id, v && isMinWords(v, 2) ? "" : (v ? "Indique nome e apelido." : ""));
        if (id === "codigo_postal") setError(id, v && isPostalPTValid(v) ? "" : (v ? "Ex: 1234-567" : ""));
        if (id === "nif") setError(id, v && isNIFValid(v) ? "" : (v ? "NIF inválido." : ""));
        if (id === "telemovel") setError(id, v && isPhonePTValid(v) ? "" : (v ? "Telemóvel inválido." : ""));
        if (id === "email") setError(id, v && isEmailValid(v) ? "" : (v ? "Email inválido." : ""));
        if (id === "matricula") setError(id, v && isMatriculaPTValid(v) ? "" : (v ? "Matrícula inválida." : ""));
        if (id === "data_nascimento") setError(id, v && isPastDate(v) ? "" : (v ? "Tem de ser no passado." : ""));
        if (id === "data_matricula") setError(id, v && isPastDate(v) ? "" : (v ? "Tem de ser no passado." : ""));
        if (id === "data_carta") setError(id, v && isPastDate(v) ? "" : (v ? "Tem de ser no passado." : ""));
        if (id === "inicio_seguro") setError(id, v && isTodayOrFuture(v) ? "" : (v ? "Hoje ou futuro." : ""));
      });
    });
  };

  // Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showStatus("");

    const ok = validate();
    if (!ok) {
      showStatus("Por favor, corrija os campos assinalados.", "error");
      const firstError = form.querySelector(".error");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const payload = getFormDataObject();

    try {
      if (API_ENDPOINT) {
        showStatus("A enviar…", "");
        const res = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Falha no envio.");
      }

      showStatus("Pedido enviado com sucesso. Vamos contactar o mais breve possível.", "success");
      form.reset();
    } catch (err) {
      showStatus("Não foi possível enviar agora. Tente novamente ou contacte-nos.", "error");
      // Mantém os dados preenchidos (não faz reset)
    }
  });

  // Menu mobile (se não tiveres isto noutro JS)
  const mobileToggle = document.getElementById("mobileToggle");
  const nav = document.getElementById("siteNav");
  if (mobileToggle && nav) {
    mobileToggle.addEventListener("click", () => {
      mobileToggle.classList.toggle("active");
      nav.classList.toggle("active");
    });
  }

  attachRealtimeValidation();
})();
