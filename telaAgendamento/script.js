    const hoje = new Date();
    const dataInput = document.getElementById("data");
    const horariosContainer = document.getElementById("horariosContainer");

    const dataISO = hoje.toISOString().split("T")[0];
    dataInput.min = dataISO;
    dataInput.value = dataISO;

    const horariosDisponiveis = [
      "7:00","7:20","7:40","8:00","8:20","8:40","9:00","9:20","9:40","10:00","10:20","10:40",
      "11:00","11:20","11:40","12:00","12:20","12:40","13:00","13:20","13:40","14:00","14:20","14:40",
      "15:00","15:20","15:40","16:00","16:20","16:40","17:00","17:20","17:40","18:00"
    ];

    function renderizarHorarios(dataSelecionada) {
      horariosContainer.innerHTML = "";
      const colunas = [[], [], []];
      const agora = new Date();
      const ehHoje = dataSelecionada === dataISO;

      horariosDisponiveis.forEach(horario => {
        const [hora, minuto] = horario.split(":").map(Number);

        if (ehHoje && (hora < agora.getHours() || (hora === agora.getHours() && minuto <= agora.getMinutes()))) {
          return;
        }

        if (colunas[0].length <= colunas[1].length && colunas[0].length <= colunas[2].length)
          colunas[0].push(horario);
        else if (colunas[1].length <= colunas[2].length)
          colunas[1].push(horario);
        else
          colunas[2].push(horario);
      });

      colunas.forEach(coluna => {
        const divColuna = document.createElement("div");
        divColuna.classList.add("coluna");

        coluna.forEach(horario => {
          const btn = document.createElement("button");
          btn.textContent = horario;
          btn.addEventListener("click", () => {
            document.querySelectorAll(".horarios button").forEach(b => b.classList.remove("selecionado"));
            btn.classList.add("selecionado");
          });
          divColuna.appendChild(btn);
        });

        horariosContainer.appendChild(divColuna);
      });
    }

    renderizarHorarios(dataISO);

    dataInput.addEventListener("change", e => renderizarHorarios(e.target.value));

    // CONFIRMAR AGENDAMENTO
    document.getElementById("btnConcluir").addEventListener("click", () => {
      const horarioSelecionado = document.querySelector(".horarios button.selecionado");

      if (!horarioSelecionado) {
        alert("Selecione um horário!");
        return;
      }

      const dataEscolhida = dataInput.value;
      const horario = horarioSelecionado.textContent;

      document.getElementById("textoConfirmacao").textContent =
        `Seu horário foi agendado para ${dataEscolhida} às ${horario}.`;

      document.getElementById("modal").classList.add("mostrar");
    });

    document.getElementById("fecharModal").addEventListener("click", () => {
      document.getElementById("modal").classList.remove("mostrar");
    });