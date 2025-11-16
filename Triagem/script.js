document.addEventListener("DOMContentLoaded", function() {
  // ===== Validação de idade e peso =====
  const idadeInput = document.getElementById('idade');
  const msgIdade = document.getElementById('msg-idade');
  const perguntaAntes60 = document.getElementById('pergunta-doacao-antes60');
  const campos = document.querySelectorAll('input:not(#idade), select:not(#doacaoAntes60)');

  function bloquearCampos(bloquear) {
    campos.forEach(campo => campo.disabled = bloquear);
  }

  function verificarIdade() {
    const idade = parseInt(idadeInput.value, 10);
    if (isNaN(idade)) {
      msgIdade.textContent = '';
      perguntaAntes60.style.display = 'none';
      bloquearCampos(false);
      return;
    }

    if (idade < 16) {
      msgIdade.textContent = 'A idade mínima para doação é de 16 anos.';
      bloquearCampos(true);
      perguntaAntes60.style.display = 'none';
    } else if (idade > 69) {
      msgIdade.textContent = 'A idade máxima para doação é de 69 anos.';
      bloquearCampos(true);
      perguntaAntes60.style.display = 'none';
    } else if (idade >= 60 && idade <= 69) {
      msgIdade.textContent = 'Para doar após os 60 anos, é necessário já ter doado antes dos 60.';
      bloquearCampos(false);
      perguntaAntes60.style.display = 'block';
    } else {
      msgIdade.textContent = '';
      bloquearCampos(false);
      perguntaAntes60.style.display = 'none';
    }
  }

  idadeInput.addEventListener('input', verificarIdade);

  // ===== Exibição condicional de perguntas por gênero =====
  const generoSelect = document.getElementById("genero");
  const perguntasHomens = document.getElementById("perguntas-homens");
  const perguntasMulheres = document.getElementById("perguntas-mulheres");

  generoSelect.addEventListener("change", () => {
    perguntasHomens.style.display = "none";
    perguntasMulheres.style.display = "none";

    if (generoSelect.value === "masculino") {
      perguntasHomens.style.display = "block";
    } else if (generoSelect.value === "feminino") {
      perguntasMulheres.style.display = "block";
    }
  });

  // ===== Navegação entre etapas =====
  const btnProsseguir = document.getElementById('botao-proxima-etapa');
  const secaoQuestionario = document.getElementById('secao-questionario');

  function validarSecaoPessoal() {
    const camposInfoPessoal = document.querySelectorAll('.info-pessoal input, .info-pessoal select');
    let todosPreenchidos = true;

    camposInfoPessoal.forEach(campo => {
      if (campo.value.trim() === '' || campo.value === 'Selecione') {
        todosPreenchidos = false;
      }
    });
    return todosPreenchidos;
  }

  btnProsseguir.addEventListener('click', (e) => {
    e.preventDefault();

    if (validarSecaoPessoal()) {
      btnProsseguir.style.display = 'none';
      secaoQuestionario.style.display = 'block';
      secaoQuestionario.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      alert("Por favor, preencha todos os campos da seção de Informações Pessoais antes de prosseguir.");
    }
  });

  // ===== Verificação das respostas e modal =====
  const perguntas = document.querySelectorAll('.pergunta');
  const botaoEnviar = document.getElementById('enviar-triagem');
  const modal = document.getElementById('modal-resultado');
  const tituloModal = document.getElementById('titulo-modal');
  const mensagemModal = document.getElementById('mensagem-modal');
  const botaoModal = document.getElementById('botao-modal');
  const fecharModal = document.getElementById('fechar-modal');

  botaoEnviar.addEventListener('click', verificarRespostas);

  function verificarRespostas() {
    const respostas = {};
    perguntas.forEach((pergunta, index) => {
      const selecionada = pergunta.querySelector('input[type="radio"]:checked');
      respostas[`q${index + 1}`] = selecionada ? selecionada.value : null;
    });

    // ===== Lógica de verificação =====
    if (respostas.q5 === 'sim') {
      mostrarModal('❌ Você teve sintomas de gripe recentemente.', 'Aguarde 7 dias após o desaparecimento dos sintomas para realizar sua doação.');
      return;
    }

    if (respostas.q13 === 'sim' || respostas.q14 === 'sim' || respostas.q15 === 'sim' || respostas.q16 === 'sim') {
      mostrarModal('🚫 Infelizmente, você não está apto(a) a doar sangue.', 'Condições médicas permanentes impedem a doação.');
      return;
    }

    if (respostas.q6 === 'sim') {
      mostrarModal('⚠️ Tratamento recente com antibióticos.', 'Aguarde pelo menos 4 semanas após o término do tratamento.');
      return;
    }

    if (respostas.q7 === 'sim') {
      mostrarModal('🩺 Procedimento médico recente.', 'Após endoscopia ou cirurgia, é necessário aguardar 6 meses.');
      return;
    }

    if (respostas.q8 === 'sim') {
      mostrarModal('🎨 Tatuagem ou micropigmentação recente.', 'Aguarde 6 meses para doar.');
      return;
    }

    if (respostas.q9 === 'sim') {
      mostrarModal('📿 Piercing ou brinco recente.', 'Aguarde 12 meses.');
      return;
    }

    if (respostas.q11 === 'sim') {
      mostrarModal('🧬 Uso de PrEP ou PEP.', 'Aguarde 3 meses após o término.');
      return;
    }

    // Caso esteja tudo certo
    mostrarModal('✅ Tudo certo!', 'Você pode seguir para a próxima etapa da triagem.');
  }

  // ===== Função do modal =====
  function mostrarModal(titulo, mensagem) {
    tituloModal.textContent = titulo;
    mensagemModal.textContent = mensagem;
    modal.style.display = 'flex';
  }

  botaoModal.addEventListener('click', () => modal.style.display = 'none');
  fecharModal.addEventListener('click', () => modal.style.display = 'none');
});
