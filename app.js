(function () {
  'use strict';

  const QUESTIONS = [
    {
      id: 'age',
      text: 'Сколько вам лет?',
      options: [
        { value: '25-29', label: '25–29' },
        { value: '30-39', label: '30–39' },
        { value: '40-49', label: '40–49' },
        { value: '50+', label: '50 и старше' },
      ],
    },
    {
      id: 'gyn',
      text: 'Когда вы последний раз были у гинеколога?',
      options: [
        { value: 'recent', label: 'Менее года назад' },
        { value: '1-2', label: '1–2 года назад' },
        { value: '2+', label: 'Более 2 лет назад' },
        { value: 'never', label: 'Не помню / ни разу' },
      ],
    },
    {
      id: 'family',
      text: 'Есть ли в семье онкологические заболевания (у близких родственников)?',
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'unknown', label: 'Не знаю' },
        { value: 'no', label: 'Нет' },
      ],
    },
    {
      id: 'smoke',
      text: 'Курите ли вы (включая иногда)?',
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'quit', label: 'Бросила, но курила раньше' },
        { value: 'no', label: 'Нет' },
      ],
    },
    {
      id: 'symptoms',
      text: 'Беспокоят ли вас симптомы, такие как боли в груди, обильные месячные, боли в первые дни цикла, нестабильный цикл?',
      options: [
        { value: 'yes', label: 'Да, есть что-то тревожное' },
        { value: 'sometimes', label: 'Иногда, но не уверена' },
        { value: 'no', label: 'Нет, чувствую себя нормально' },
      ],
    },
  ];

  function isHighPriority() {
    return (
      answers.symptoms === 'yes' ||
      answers.gyn === '2+' ||
      answers.gyn === 'never' ||
      answers.symptoms === 'sometimes'
    );
  }

  function buildChecklist() {
    var priority = isHighPriority();
    var steps = [
      {
        title: 'УЗИ органов малого таза',
        desc: 'Базовое исследование для оценки состояния репродуктивных органов.',
        period: priority ? 'В ближайшие недели' : '1 раз в год',
        priority: priority,
      },
      {
        title: 'Осмотр гинеколога + онкоцитология (мазок)',
        desc: 'Осмотр и скрининг шейки матки — ключевой шаг профилактики.',
        period: priority ? 'Как можно скорее' : '1 раз в год',
        priority: priority,
      },
      {
        title: 'УЗИ молочных желёз',
        desc: 'Раннее выявление изменений в молочных железах.',
        period: 'В рамках того же визита',
        priority: priority,
      },
      {
        title: 'УЗИ щитовидной железы',
        desc: 'Щитовидная железа влияет на цикл и общее самочувствие — стоит проверить.',
        period: 'В рамках того же визита',
        priority: priority,
      },
      {
        title: 'Консультация по результатам УЗИ',
        desc: 'Врач объяснит результаты и подскажет, нужны ли дополнительные шаги.',
        period: 'После обследований',
        priority: priority,
      },
      {
        title: 'Повторный приём по мазку',
        desc: 'Только если результат нехороший. Если хороший — отметьте в сервисе «Бережно», повторный визит не нужен.',
        period: 'По необходимости',
        priority: false,
      },
    ];

    var booking = [
      {
        title: 'По полису ОМС',
        desc: 'К участковому гинекологу в поликлинике по месту прописки или прикрепления.',
        period: 'Бесплатно',
        priority: false,
      },
      {
        title: 'Платная клиника',
        desc: 'Любая клиника на ваш выбор — удобнее по времени и локации.',
        period: 'На ваш выбор',
        priority: false,
      },
      {
        title: 'Партнёры «Бережно»',
        desc: 'Клиники-партнёры сервиса — со скидкой для пользователей (в полной версии).',
        period: 'Записаться онлайн со скидкой 20%',
        priority: false,
      },
    ];

    var reminders = [
      {
        title: 'Отметьте месяц визита',
        desc: 'После всех обследований отметьте в сервисе, когда прошли чек-ап.',
        period: 'Демо',
        priority: false,
      },
      {
        title: 'Напоминания перед повтором',
        desc: 'Сервис напомнит за 2 месяца, за 1 месяц и в нужный месяц.',
        period: 'Демо',
        priority: false,
      },
      {
        title: 'Повтор обследования',
        desc: 'Плановый чек-ап — раз в год. Сроки уточняет врач.',
        period: 'Раз в год',
        priority: false,
      },
    ];

    var footnotes = [];

    if (answers.smoke === 'yes' || answers.smoke === 'quit') {
      footnotes.push(
        'Вы указали, что курите или курили раньше — обсудите с врачом программу отказа от курения: это снижает онкологические риски.'
      );
    }

    if (answers.family === 'yes') {
      footnotes.push(
        'В семье были онкологические заболевания — сообщите об этом гинекологу, возможны более частые обследования.'
      );
    }

    if (answers.symptoms === 'yes') {
      footnotes.unshift(
        'Вы отметили тревожные симптомы — не откладывайте визит. Этот маршрут не заменяет срочную медицинскую помощь.'
      );
    }

    return {
      priority: priority,
      exam: steps,
      booking: booking,
      reminders: reminders,
      footnotes: footnotes,
    };
  }

  let currentStep = 0;
  const answers = {};

  const testBody = document.getElementById('testBody');
  const progressBar = document.getElementById('progressBar');
  const progressLabel = document.getElementById('progressLabel');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const testCard = document.getElementById('testCard');
  const checklistSection = document.getElementById('checklist');
  const checklistSummary = document.getElementById('checklistSummary');
  const checklistItems = document.getElementById('checklistItems');
  const btnRestart = document.getElementById('btnRestart');

  function createPetals() {
    var container = document.querySelector('.petals');
    var count = 34;
    var depths = ['petal--far', 'petal--mid', 'petal--near'];
    var colors = ['petal--yellow', 'petal--pink'];
    var p;

    for (var i = 0; i < count; i++) {
      var isFlower = Math.random() > 0.48;
      var depth = depths[Math.floor(Math.random() * depths.length)];
      var color = colors[Math.floor(Math.random() * colors.length)];
      var size = 16 + Math.random() * 12;
      var sway = 35 + Math.random() * 45;
      var rot = Math.floor(Math.random() * 360);
      var el;

      if (isFlower) {
        el = document.createElement('span');
        el.className = 'petal petal--flower ' + depth + ' ' + color;
        for (p = 0; p < 8; p++) {
          var lobe = document.createElement('span');
          lobe.className = 'petal__lobe';
          lobe.style.setProperty('--lobe-rot', p * 45 + 'deg');
          el.appendChild(lobe);
        }
        var center = document.createElement('span');
        center.className = 'petal__center';
        el.appendChild(center);
      } else {
        el = document.createElement('span');
        el.className = 'petal petal--solo ' + depth + ' ' + color;
      }

      el.style.left = Math.random() * 100 + '%';
      el.style.setProperty('--size', size + 'px');
      el.style.setProperty('--start-rot', rot + 'deg');
      el.style.setProperty('--sway', sway + 'px');
      el.style.animationDuration = 22 + Math.random() * 18 + 's';
      el.style.animationDelay = Math.random() * 14 + 's';
      container.appendChild(el);
    }
  }

  function updateProgress() {
    const pct = ((currentStep + 1) / QUESTIONS.length) * 100;
    progressBar.style.setProperty('--progress', pct + '%');
    progressLabel.textContent = 'Вопрос ' + (currentStep + 1) + ' из ' + QUESTIONS.length;
  }

  function renderQuestion() {
    const q = QUESTIONS[currentStep];
    const selected = answers[q.id] || '';

    testBody.innerHTML =
      '<p class="test-question">' + q.text + '</p>' +
      '<div class="test-options">' +
      q.options.map(function (opt) {
        var checked = selected === opt.value ? ' checked' : '';
        return (
          '<label class="test-option">' +
          '<input type="radio" name="' + q.id + '" value="' + opt.value + '"' + checked + '>' +
          '<span>' + opt.label + '</span>' +
          '</label>'
        );
      }).join('') +
      '</div>';

    testBody.querySelectorAll('input[type="radio"]').forEach(function (input) {
      input.addEventListener('change', function () {
        answers[q.id] = input.value;
      });
    });

    btnPrev.hidden = currentStep === 0;
    btnNext.textContent = currentStep === QUESTIONS.length - 1 ? 'Показать чек-лист' : 'Далее';
    updateProgress();
  }

  function getAgeLabel() {
    var map = {
      '25-29': '25–29 лет',
      '30-39': '30–39 лет',
      '40-49': '40–49 лет',
      '50+': '50+ лет',
    };
    return map[answers.age] || '';
  }

  function renderChecklistItem(item, num) {
    var cls = item.priority ? ' checklist-item--priority' : '';
    return (
      '<li class="checklist-item' + cls + '">' +
      '<span class="checklist-item__icon">' + num + '</span>' +
      '<div class="checklist-item__body">' +
      '<h4>' + item.title + '</h4>' +
      '<p>' + item.desc + '</p>' +
      '<span class="checklist-item__tag">' + item.period + '</span>' +
      '</div></li>'
    );
  }

  function renderSectionHeader(title, subtitle, priority) {
    var cls = priority ? ' checklist-item--priority' : '';
    return (
      '<li class="checklist-item' + cls + '">' +
      '<div class="checklist-item__body">' +
      '<h4>' + title + '</h4>' +
      (subtitle ? '<p>' + subtitle + '</p>' : '') +
      '</div></li>'
    );
  }

  function showChecklist() {
    var data = buildChecklist();
    var html = [];
    var num = 1;

    if (data.priority) {
      checklistSummary.innerHTML =
        'Для возраста <strong>' + getAgeLabel() + '</strong> собран <strong>приоритетный маршрут</strong> ' +
        'на основе ваших ответов. Рекомендуем начать обследование в ближайшее время.';
    } else {
      checklistSummary.innerHTML =
        'Для возраста <strong>' + getAgeLabel() + '</strong> — ваш плановый маршрут профилактики. ' +
        'Пройдите шаги за один–два визита, повторяйте раз в год.';
    }

    html.push(renderSectionHeader(
      'Комплексное гинекологическое обследование',
      'Единый маршрут — пройдите по шагам за один–два визита.',
      data.priority
    ));
    data.exam.forEach(function (item) {
      html.push(renderChecklistItem(item, num));
      num++;
    });

    html.push(renderSectionHeader('Куда записаться', null, false));
    data.booking.forEach(function (item) {
      html.push(renderChecklistItem(item, num));
      num++;
    });

    html.push(renderSectionHeader('Напоминания', 'Демо — как будет работать сервис в полной версии.', false));
    data.reminders.forEach(function (item) {
      html.push(renderChecklistItem(item, num));
      num++;
    });

    if (data.footnotes.length) {
      html.push(
        '<li class="checklist-item">' +
        '<div class="checklist-item__body">' +
        data.footnotes.map(function (note) {
          return '<p>' + note + '</p>';
        }).join('') +
        '</div></li>'
      );
    }

    checklistItems.innerHTML = html.join('');

    testCard.closest('.section').hidden = true;
    checklistSection.hidden = false;
    checklistSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function restartTest() {
    currentStep = 0;
    Object.keys(answers).forEach(function (k) { delete answers[k]; });
    testCard.closest('.section').hidden = false;
    checklistSection.hidden = true;
    renderQuestion();
    document.getElementById('test').scrollIntoView({ behavior: 'smooth' });
  }

  btnNext.addEventListener('click', function () {
    var q = QUESTIONS[currentStep];
    if (!answers[q.id]) {
      testBody.querySelector('.test-question').style.color = '#ec407a';
      setTimeout(function () {
        testBody.querySelector('.test-question').style.color = '';
      }, 600);
      return;
    }

    if (currentStep < QUESTIONS.length - 1) {
      currentStep++;
      renderQuestion();
    } else {
      showChecklist();
    }
  });

  btnPrev.addEventListener('click', function () {
    if (currentStep > 0) {
      currentStep--;
      renderQuestion();
    }
  });

  btnRestart.addEventListener('click', restartTest);

  createPetals();
  renderQuestion();
})();
