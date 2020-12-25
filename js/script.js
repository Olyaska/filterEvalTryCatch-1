'use strict';
// создание функций:
const filterByType = (type, ...values) => values.filter(value => typeof value === type), // функция, которая возвращает значения, соответствующие типу type

	hideAllResponseBlocks = () => { // функция, для скрытия неиспользуемых блоков
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		responseBlocksArray.forEach(block => block.style.display = 'none');
	},

	showResponseBlock = (blockSelector, msgText, spanSelector) => { // общая функция для передачи сообщений в различные блоки
		hideAllResponseBlocks(); // скрыть все блоки
		document.querySelector(blockSelector).style.display = 'block'; // получить нужный блок и показать его
		if (spanSelector) { // если передан spanSelector
			document.querySelector(spanSelector).textContent = msgText; // добавить в блок текст сообщения
		}
	},

	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'), //функция для вывода сообщений с ошибкой

	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),//функция для вывода сообщений с результатом

	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),//функция для вывода пустого блока

	tryFilterByType = (type, values) => { //функция запускает код и отлавливает ошибки
		try {
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", "); 
			// eval выполняет строку, как код, берет результат выполнения filterByType, join превращает его в строку
			const alertMsg = (valuesArray.length) ? // формирует текст сообщения: длина строки != 0 ?
				`Данные с типом ${type}: ${valuesArray}` : //"Да" - верни текст с типом и данными
				`Отсутствуют данные типа ${type}`; // "Нет" - верни текст с типом
			showResults(alertMsg); // Вывести сообщение в зеленом блоке с резульатами
		} catch (e) {
			showError(`Ошибка: ${e}`); // В блоке try произошла ошибка: вывести текст ошибки в красном блоке
		}
	};

const filterButton = document.querySelector('#filter-btn'); // Получаем кнопку "Фильтровать"

filterButton.addEventListener('click', e => { // Навешиваем на нее событие клик
	const typeInput = document.querySelector('#type'); // получаем инпуты
	const dataInput = document.querySelector('#data');

	if (dataInput.value === '') { // Проверка, что поле "Данные" не пустое
		dataInput.setCustomValidity('Поле не должно быть пустым!'); // Сообщение от браузера, что поле не заполнено
		showNoResults(); //показать пустое поле результатов
	} else {
		dataInput.setCustomValidity(''); // Очистить сообщение от браузера
		e.preventDefault(); // отменить действие по умолчанию
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim()); //запусть функцию tryFilterByType 
	}
});