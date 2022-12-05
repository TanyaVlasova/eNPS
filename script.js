let LOYALTY_DATA = [
    {
        category: 'Промоутеры',
        elem: document.querySelector('.pie-chart__promoter'),
        users: 0,
        percent: 0,
        lastPercent: 0,
        difference: 0,
        dashoffset: null,
    },
    {
        category: 'Скептики',
        elem: document.querySelector('.pie-chart__skeptic'),
        users: 0,
        percent: 0,
        lastPercent: 0,
        difference: 0,
        dashoffset: null,
    },
    {
        category: 'Критики',
        elem: document.querySelector('.pie-chart__critic'),
        users: 0,
        percent: 0,
        lastPercent: 0,
        difference: 0,
        dashoffset: null,
    },
];

fillLabels();
fillResults();

let calcForm = document.forms.calc;
calcForm.addEventListener('submit', event => {
    event.preventDefault();
    const totalUsers = makeCalculations();
    if (!totalUsers) return;
    drawPieChart();
    fillResults();
    drawBarChart();
});

function fillLabels() {
    const labels = Array.from(document.forms.calc.querySelectorAll('.form__label'));
    if (labels.length > LOYALTY_DATA.length) {
        throw new Error('Не хватает данных LOYALTY_DATA для отрисовки всех элементов формы');
    }
    labels.map((elem, index) => {
        elem.innerHTML = LOYALTY_DATA[index].category;
    });
}

function makeCalculations() {
    let calcFormText = calcForm.elements['calc-text'];
    let totalUsers = 0;

    LOYALTY_DATA.map((elem, index) => {
        elem.users = +calcFormText[index].value;
        totalUsers += elem.users;
    })

    if (!totalUsers) return 0;
    LOYALTY_DATA.map(elem => {
        elem.lastPercent = elem.percent;
        elem.percent = elem.users / totalUsers * 100;
    });
    return totalUsers; 
}

function fillResults() {
    const results = Array.from(document.querySelector('.js-results').children);
    if (results.length > LOYALTY_DATA.length) {
        throw new Error('Не хватает данных LOYALTY_DATA для отрисовки всех категорий');
    }
    results.map((elem, index) => {
        elem.querySelector('.js-category').innerHTML = LOYALTY_DATA[index].category;
        elem.querySelector('.js-percent').innerHTML = LOYALTY_DATA[index].percent.toFixed(1) + '%';
        elem.querySelector('.js-users').innerHTML = LOYALTY_DATA[index].users;
    });  
};

function drawPieChart() {
    let pieChartBase = document.querySelector('.pie-chart__base');
    let pieChartStart = parseFloat(getComputedStyle(pieChartBase).strokeDasharray); // от 314.15
    let pieChartStop = parseFloat(getComputedStyle(pieChartBase).strokeDashoffset); // до 50
    let pieChartLength = pieChartStart - pieChartStop; // 264.15 -- 100%

    LOYALTY_DATA[0].dashoffset = pieChartStop;
    for (let i = 1; i < LOYALTY_DATA.length; i++) {
        LOYALTY_DATA[i].dashoffset = LOYALTY_DATA[i-1].dashoffset + pieChartLength / 100 * LOYALTY_DATA[i-1].percent;
    }

    for (let elem of LOYALTY_DATA) {
        elem.elem.style.strokeDashoffset = elem.dashoffset;
    }
}

function drawBarChart() {
    const results = Array.from(document.querySelector('.js-results').children);
    const barChart = document.querySelector('.js-bar-chart');
    const barChartWidth = parseFloat(getComputedStyle(barChart).width); // 130

    results.map((elem, index) => {
        let elemData = LOYALTY_DATA[index];
        elemData.difference = elemData.percent - elemData.lastPercent;
        if (elemData.difference > 0) {
            elem.querySelector('.js-difference').innerHTML = `+${elemData.difference.toFixed(1)}%`;
        } else {
            elem.querySelector('.js-difference').innerHTML = `${elemData.difference.toFixed(1)}%`;
        }
        elem.querySelector('.js-new-percent').style.width = elemData.percent + '%';
        elem.querySelector('.js-last-percent').style.width = elemData.lastPercent + '%';
    })
}