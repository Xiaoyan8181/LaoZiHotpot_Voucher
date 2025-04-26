document.addEventListener('DOMContentLoaded', () => {
  const addMealBtn = document.getElementById('addMealBtn');
  const mealForm = document.getElementById('mealForm');
  const mealType = document.getElementById('mealType');
  const soupBaseSection = document.getElementById('soupBaseSection');
  const soupBase = document.getElementById('soupBase');
  const soupBase2Section = document.getElementById('soupBase2Section');
  const soupBase2 = document.getElementById('soupBase2');
  const mainDishSection = document.getElementById('mainDishSection');
  const mainDish = document.getElementById('mainDish');
  const giftSection = document.getElementById('giftSection');
  const gift = document.getElementById('gift');
  const extraSection = document.getElementById('extraSection');
  const extra = document.getElementById('extra');
  const confirmBtn = document.getElementById('confirmBtn');
  const orderList = document.getElementById('orderList');
  const clearOrdersBtn = document.getElementById('clearOrdersBtn');

  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  renderOrders();

  addMealBtn.addEventListener('click', () => {
    mealForm.classList.toggle('hidden');
    resetForm();
  });

  mealType.addEventListener('change', () => {
    hideAllSections();
    resetSelections();
    mainDish.innerHTML = '<option value="">請選擇主食</option>';
    gift.innerHTML = '<option value="">請選擇贈品</option>';

    if (mealType.value === '428' || mealType.value === '438') {
      soupBaseSection.classList.remove('hidden');
      mainDishSection.classList.remove('hidden');
      addOptions(soupBase, mealType.value === '428' ? ['豬肚', '酸菜魚'] : ['麻辣', '牛奶']);
      addOptions(mainDish, ['梅花豬120克', '豬五花120克', '牛五花100克']);
    } else if (mealType.value === '438gift') {
      soupBaseSection.classList.remove('hidden');
      mainDishSection.classList.remove('hidden');
      giftSection.classList.remove('hidden');
      addOptions(soupBase, ['麻辣', '牛奶']);
      addOptions(mainDish, ['梅花豬120克', '豬五花120克', '牛五花100克']);
      addOptions(gift, ['梅花豬100克', '豬五花100克', '花枝漿', '鯛魚片']);
    } else if (mealType.value === '548' || mealType.value === '548gift' || mealType.value === '558') {
      soupBaseSection.classList.remove('hidden');
      mainDishSection.classList.remove('hidden');
      if (mealType.value === '548gift') {
        giftSection.classList.remove('hidden');
        addOptions(gift, ['梅花豬100克', '豬五花100克', '花枝漿', '鯛魚片']);
      }
      addOptions(soupBase, mealType.value === '558' ? ['麻辣', '牛奶'] : ['豬肚', '酸菜魚']);
      addOptions(mainDish, ['板腱牛120克', '沙朗牛120克', '松阪豬120克', '小羔羊120克']);
    } else if (mealType.value === '1988') {
      soupBaseSection.classList.remove('hidden');
      soupBase2Section.classList.remove('hidden');
      giftSection.classList.remove('hidden');
      addOptions(soupBase, ['和風', '蔬食']);
      addOptions(soupBase2, ['和風', '蔬食']);
      mainDish.innerHTML = '<option value="龍王綜合海鮮乙盤 + 牛小排150g乙盤" selected>龍王綜合海鮮乙盤 + 牛小排150g乙盤</option>';
      mainDish.disabled = true;
      addOptions(gift, ['板腱牛100克', '松阪豬100克', '蝦滑乙支']);
    } else if (mealType.value === 'meat') {
      extraSection.classList.remove('hidden');
      addOptions(extra, ['板腱牛100克', '牛五花100克', '豬五花100克', '梅花豬100克', '小羔羊100克']);
    } else if (mealType.value === 'abalone') {
      // 鮑魚白蝦兌換券無額外選項
    } else if (mealType.value === '3points') {
      extraSection.classList.remove('hidden');
      addOptions(extra, ['豆皮', '麻吉燒', '油條', '時蔬']);
    } else if (mealType.value === '5points') {
      extraSection.classList.remove('hidden');
      addOptions(extra, ['梅花豬', '豬五花', '花枝漿', '鯛魚']);
    } else if (mealType.value === '8points') {
      extraSection.classList.remove('hidden');
      addOptions(extra, ['板腱牛', '沙朗牛', '小羔羊', '松阪豬', '素食組合']);
    } else if (mealType.value === '10points') {
      extraSection.classList.remove('hidden');
      addOptions(extra, ['白蝦', '超值海鮮']);
    } else if (mealType.value === '15points') {
      extraSection.classList.remove('hidden');
      addOptions(extra, ['黑牛']);
    } else if (mealType.value === '20points') {
      extraSection.classList.remove('hidden');
      addOptions(extra, ['M9和牛']);
    }
    checkConfirmButton();
  });

  [soupBase, soupBase2, mainDish, gift, extra].forEach(select => {
    select.addEventListener('change', checkConfirmButton);
  });

  confirmBtn.addEventListener('click', () => {
    const order = {
      category: getCategory(mealType.value),
      meal: mealType.options[mealType.selectedIndex].text,
      soup: soupBase.value || null,
      soup2: soupBase2.value || null,
      main: mainDish.value || null,
      gift: gift.value || null,
      extra: extra.value || null,
      id: Date.now()
    };
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    renderOrders();
    resetForm();
    mealForm.classList.add('hidden');
  });

  clearOrdersBtn.addEventListener('click', () => {
    if (confirm('是否確定清空所有餐點？')) {
      orders = [];
      localStorage.setItem('orders', JSON.stringify(orders));
      renderOrders();
    }
  });

  function addOptions(select, options) {
    select.innerHTML = '<option value="">請選擇' + (select.id === 'soupBase' || select.id === 'soupBase2' ? '湯底' : select.id === 'mainDish' ? '主食' : select.id === 'gift' ? '贈品' : '兌換選項') + '</option>';
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      select.appendChild(opt);
    });
  }

  function resetForm() {
    mealType.value = '';
    soupBase.innerHTML = '<option value="">請選擇湯底</option>';
    soupBase2.innerHTML = '<option value="">請選擇第二鍋湯底</option>';
    mainDish.innerHTML = '<option value="">請選擇主食</option>';
    mainDish.disabled = false;
    gift.innerHTML = '<option value="">請選擇贈品</option>';
    extra.innerHTML = '<option value="">請選擇兌換選項</option>';
    hideAllSections();
    confirmBtn.disabled = true;
  }

  function resetSelections() {
    soupBase.value = '';
    soupBase2.value = '';
    mainDish.value = '';
    gift.value = '';
    extra.value = '';
  }

  function hideAllSections() {
    soupBaseSection.classList.add('hidden');
    soupBase2Section.classList.add('hidden');
    mainDishSection.classList.add('hidden');
    giftSection.classList.add('hidden');
    extraSection.classList.add('hidden');
  }

  function getCategory(mealValue) {
    if (['428', '438', '438gift', '548', '548gift', '558', '1988'].includes(mealValue)) return 'main';
    if (['meat', 'abalone'].includes(mealValue)) return 'gift';
    if (['3points', '5points', '8points', '10points', '15points', '20points'].includes(mealValue)) return 'points';
    return '';
  }

  function checkConfirmButton() {
    const isMealSelected = mealType.value !== '' && !['main', 'gift', 'points'].includes(mealType.value);
    let isValid = isMealSelected;

    if (['428', '438', '548', '558'].includes(mealType.value)) {
      isValid = isValid && soupBase.value !== '' && mainDish.value !== '';
    } else if (['438gift', '548gift'].includes(mealType.value)) {
      isValid = isValid && soupBase.value !== '' && mainDish.value !== '' && gift.value !== '';
    } else if (mealType.value === '1988') {
      isValid = isValid && soupBase.value !== '' && soupBase2.value !== '' && gift.value !== '';
    } else if (mealType.value === 'meat') {
      isValid = isValid && extra.value !== '';
    } else if (mealType.value === 'abalone') {
      isValid = true;
    } else if (['3points', '5points', '8points', '10points', '15points', '20points'].includes(mealType.value)) {
      isValid = isValid && extra.value !== '';
    }
    confirmBtn.disabled = !isValid;
  }

  function renderOrders() {
    orderList.innerHTML = '';
    clearOrdersBtn.classList.toggle('hidden', orders.length === 0);

    const categories = [
      { key: 'main', label: '主餐' },
      { key: 'gift', label: '禮物券' },
      { key: 'points', label: '點數兌換' }
    ];

    categories.forEach(cat => {
      const catOrders = orders.filter(order => order.category === cat.key);
      if (catOrders.length > 0) {
        const header = document.createElement('h3');
        header.textContent = cat.label;
        orderList.appendChild(header);
        catOrders.forEach(order => {
          const li = document.createElement('li');
          let text = `${order.meal}`;
          if (order.soup) text += ` | 湯底: ${order.soup}`;
          if (order.soup2) text += ` | 第二鍋湯底: ${order.soup2}`;
          if (order.main) text += ` | 主食: ${order.main}`;
          if (order.gift) text += ` | 贈品: ${order.gift}`;
          if (order.extra) text += ` | 兌換: ${order.extra}`;
          li.textContent = text;

          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = '刪除';
          deleteBtn.classList.add('delete-btn');
          deleteBtn.addEventListener('click', () => {
            if (confirm('是否確定刪除此餐點？')) {
              orders = orders.filter(o => o.id !== order.id);
              localStorage.setItem('orders', JSON.stringify(orders));
              renderOrders();
            }
          });
          li.appendChild(deleteBtn);
          orderList.appendChild(li);
        });
      }
    });
  }
});