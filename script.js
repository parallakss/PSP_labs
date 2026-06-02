window.onload = function() {
  const outputElement = document.getElementById('result');
  const serviceCards = document.querySelectorAll('[data-service-card]');
  const modal = document.getElementById('service-modal');
  const closeButtons = document.querySelectorAll('[data-close-modal]');

  if (modal) {
    const modalTitle = document.getElementById('service-modal-title');
    const modalClass = document.getElementById('service-modal-class');
    const modalImage = document.getElementById('service-modal-image');
    const modalDescription = document.getElementById('service-modal-description');

    function closeModal() {
      modal.setAttribute('hidden', '');
      document.body.classList.remove('modal-open');
    }

    serviceCards.forEach((card) => {
      card.addEventListener('click', function() {
        const title = card.dataset.serviceTitle || '';
        const shipClass = card.dataset.serviceClass || '';
        const image = card.dataset.serviceImage || '';
        const description = card.dataset.serviceDescription || '';

        modalTitle.textContent = title;
        modalClass.textContent = shipClass;
        modalDescription.textContent = description;
        modalImage.alt = title;

        if (image) {
          modalImage.src = image;
          modalImage.style.display = 'block';
        } else {
          modalImage.removeAttribute('src');
          modalImage.style.display = 'none';
        }

        modal.removeAttribute('hidden');
        document.body.classList.add('modal-open');
      });
    });

    closeButtons.forEach((button) => {
      button.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
        closeModal();
      }
    });
  }

  if (!outputElement) {
    return;
  }

  let a = '';
  let b = '';
  let selectedOperation = null;
  let lastOperation = null;
  let lastOperand = '';

  function updateOutput(value) {
    outputElement.textContent = value;
  }

  function currentValue() {
    return selectedOperation ? b : a;
  }

  function setCurrentValue(value) {
    if (selectedOperation) {
      b = value;
    } else {
      a = value;
    }
  }

  function trimResult(value) {
    if (!Number.isFinite(value)) {
      return String(value);
    }
    if (Number.isInteger(value)) {
      return String(value);
    }
    return String(parseFloat(value.toFixed(10))).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
  }

  function appendDigit(digit) {
    let current = currentValue();

    if (digit === '.' && current.includes('.')) {
      return;
    }

    if (digit === '.' && current === '') {
      current = '0';
    }

    if (current === '0' && digit !== '.') {
      current = digit;
    } else {
      current += digit;
    }

    setCurrentValue(current);
    updateOutput(current);
  }

  function clearAll() {
    a = '';
    b = '';
    selectedOperation = null;
    lastOperation = null;
    lastOperand = '';
    updateOutput('0');
  }

  function backspace() {
    let current = currentValue();
    if (!current) {
      return;
    }

    current = current.slice(0, -1);
    if (current === '-') {
      current = '';
    }

    setCurrentValue(current);
    updateOutput(current || '0');
  }

  function toggleSign() {
    let current = currentValue();
    if (!current) {
      return;
    }

    if (current.startsWith('-')) {
      current = current.slice(1);
    } else {
      current = '-' + current;
    }

    setCurrentValue(current);
    updateOutput(current);
  }

  function percent() {
    let current = currentValue();
    if (!current) {
      return;
    }

    const value = Number(current) / 100;
    const result = trimResult(value);
    setCurrentValue(result);
    updateOutput(result);
  }

  function applyUnary(operation) {
    let current = currentValue();
    if (!current) {
      return;
    }

    const value = Number(current);
    const result = operation(value);

    if (!Number.isFinite(result) || Number.isNaN(result)) {
      updateOutput('Ошибка');
      a = '';
      b = '';
      selectedOperation = null;
      return;
    }

    const stringValue = trimResult(result);
    setCurrentValue(stringValue);
    updateOutput(stringValue);
  }

  function applyTripleZero() {
    let current = currentValue();
    if (!current) {
      return;
    }

    if (current === '0') {
      current = '0';
    } else {
      current += '000';
    }

    setCurrentValue(current);
    updateOutput(current);
  }

  function setOperation(operation) {
    if (a === '') {
      return;
    }

    if (selectedOperation && b !== '') {
      computeResult();
    }

    selectedOperation = operation;
  }

  function operate(x, y, operation) {
    switch (operation) {
      case '+':
        return x + y;
      case '-':
        return x - y;
      case 'x':
        return x * y;
      case '/':
        return y === 0 ? NaN : x / y;
      default:
        return NaN;
    }
  }

  function computeResult() {
    if (a === '') {
      return;
    }

    if (b === '') {
      if (lastOperation && lastOperand !== '') {
        b = lastOperand;
        selectedOperation = lastOperation;
      } else {
        return;
      }
    }

    const result = operate(Number(a), Number(b), selectedOperation);
    if (!Number.isFinite(result) || Number.isNaN(result)) {
      updateOutput('Ошибка');
      a = '';
      b = '';
      selectedOperation = null;
      return;
    }

    a = trimResult(result);
    lastOperation = selectedOperation;
    lastOperand = b;
    b = '';
    selectedOperation = null;
    updateOutput(a);
  }

  function factorial(n) {
    if (n < 0 || !Number.isInteger(n) || n > 20) {
      return NaN;
    }

    let result = 1;
    for (let i = 1; i <= n; i += 1) {
      result *= i;
    }
    return result;
  }

  const digitButtons = document.querySelectorAll('[id^="btn_digit_"]');
  digitButtons.forEach(button => {
    button.onclick = function() {
      appendDigit(button.innerHTML);
    };
  });

  document.getElementById('btn_op_clear').onclick = clearAll;
  document.getElementById('btn_op_sign').onclick = toggleSign;
  document.getElementById('btn_op_percent').onclick = percent;
  document.getElementById('btn_backspace').onclick = backspace;
  document.getElementById('btn_000').onclick = applyTripleZero;
  document.getElementById('btn_sqrt').onclick = function() {
    applyUnary(value => value < 0 ? NaN : Math.sqrt(value));
  };
  document.getElementById('btn_square').onclick = function() {
    applyUnary(value => value * value);
  };
  document.getElementById('btn_factorial').onclick = function() {
    applyUnary(factorial);
  };

  document.getElementById('btn_op_plus').onclick = function() {
    setOperation('+');
  };
  document.getElementById('btn_op_minus').onclick = function() {
    setOperation('-');
  };
  document.getElementById('btn_op_mult').onclick = function() {
    setOperation('x');
  };
  document.getElementById('btn_op_div').onclick = function() {
    setOperation('/');
  };
  document.getElementById('btn_op_equal').onclick = computeResult;

  document.getElementById('btn_theme').onclick = function() {
    document.body.classList.toggle('theme-light');
  };
};
