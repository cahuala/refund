// selecionar os elementos do formulário
const form = document.querySelector('form');
const amount = document.getElementById('amount');
const expense = document.getElementById('expense');
const category = document.getElementById('category');

// selecionar os elementos da lista

const expenseList = document.querySelector('ul');
const expenseQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2");
// capturar o evento de input no campo de valor e formatar para numeros
amount.oninput = ()=> {
  let value = amount.value.replace(/\D/g, "");
  value = Number(value) / 100;
  amount.value= formatCurrentyAOA(value);
}

function formatCurrentyAOA(value){
  value = value.toLocaleString("pt-BR",{
    style: "currency",
    currency: "AOA"
  });
  return value;
}

form.onsubmit = (event) => {
  event.preventDefault();
  const newExpense ={
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date()
  }
  expenseAdd(newExpense);
}

function expenseAdd(newExpense){
  try {
    const expenseItem = document.createElement('li');
    expenseItem.classList.add("expense")

    const expenseIcon = document.createElement('img');
    expenseIcon.setAttribute('src', `./img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute('alt', newExpense.category_name);

    const expenseInfo = document.createElement('div');
    expenseInfo.classList.add('expense-info');

    const expenseName = document.createElement('strong');
    expenseName.textContent = newExpense.expense;

    const expenseCategory = document.createElement('span');
    expenseCategory.textContent = newExpense.category_name;

    const expenseAmount = document.createElement('span');
    expenseAmount.classList.add('expense-amount');

    const expenseSmall = document.createElement('small');
    expenseSmall.textContent = "AOA";
    expenseAmount.append(expenseSmall, newExpense.amount.toUpperCase().replace("AOA", ""));

    const expenseRemove = document.createElement('img');
    expenseRemove.classList.add('remove-icon');
    expenseRemove.setAttribute('src', `./img/remove.svg`);
    expenseRemove.setAttribute('alt', 'Remover despesa');
    // adicionar nome e categoria na div expenseInfo
    expenseInfo.append(expenseName, expenseCategory);
    // adicionar a tag imagem na li
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount,expenseRemove);
    // adicionar a li na tag ul
    expenseList.append(expenseItem);
    updateTotals();
    formClear();
  } catch (error) {
    alert("Não foi possivel actualizar a lista de despesas")
    console.log(error);
  }
}

function updateTotals() {
  try {
    const items = expenseList.children;
    expenseQuantity.textContent = `${items.length} ${items.length>1 ? "despesas" : "despesa"}`;
    let total = 0;
    for (const item of items) {
      const itemAmount = item.querySelector('.expense-amount')
      let value= itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".");
      value = parseFloat(value);
      if (isNaN(value)) {
        return alert("Não foi possível calcular o total, Valor inválido");
      }
      total +=Number(value);
    }
    const symbolAOA =document.createElement('small');
    symbolAOA.textContent = "AOA";
    total =formatCurrentyAOA(total).toUpperCase().replace("AOA", "");

   
    expenseTotal.innerHTML = "";
    expenseTotal.append(symbolAOA, total);
  } catch (error) {
    alert("Não foi possivel actualizar o total de despesas")
    console.log(error);
  }
}

expenseList.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('remove-icon')) {
    target.parentElement.remove();
    updateTotals();
  }
});

function formClear() {
  expense.value = "";
  amount.value = "";
  category.selectedIndex = 0;
  expense.focus();
}