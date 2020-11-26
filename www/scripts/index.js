let foundDrugs = [];

$('#drugFind').click(() => {
    foundDrugs = [];
    $('#found').text('');
    $('#addressInput').val('');
    if ($('#drugInput').val().length < 1) return $('#results').html('Запрос должен быть длиннее 1-й буквы');
    $('#results').html('Подождите...');
    if ($('#drugInput').val() == 'тест ошибки') throw new Error('Выброшено тестовое исключение');
    $.ajax({
        method: 'POST',
        url: 'https://apteka-omsk.ru/node?ajax_form=1',
        dataType: 'JSON',
        data: {
            title: $('#drugInput').val(),
            form_id: 'ajax_search'
        },
        success: raw => {
            console.log(raw);
            $('#results').html('');
            let dom = $.parseHTML(raw[0].data.replace(/<img[^>]*>/g, "").replace(/<link[^>]*>/g, "").replace(/<style[^>]*>/g, "").replace(/<script[^>]*>/g, ""));
            let rows = $('.result', dom).get();
            if (!rows.length) return console.log('No rows!');
            if (/^По вашему запросу ничего не найдено/i.test($(rows[0]).text())) return $('#results').html('Ничего не найдено');
            if (/^В Вашем запросе должно быть более 3х букв/i.test($(rows[0]).text())) return $('#results').html('Запрос должен быть длиннее 1-й буквы');
            rows.forEach((el) => {
                let cols = $(el).children().get();
                let drug = [$(cols[0]).text(), +$(cols[1]).text().replace(' руб.', ''), $(cols[2]).text().trim()];
                foundDrugs.push(drug);
                //console.log('Drug:', drug);
            });
            redraw();
            $('#found').text('Найдено: ' + foundDrugs.length);
            //console.log("Все строки: ", rows, "; все найденные: ", foundDrugs);
        },
        error: (jqXHR, eStr, err) => {
            $('#results').html(`<b>Что-то пошло не так</b><br/>${eStr}<br/>${typeof err == 'string' ? err : (err.stack ? err.stack : '')}`);
        }
    });
});

function redraw() {
    console.log('redraw called');
    $('#results').html('');
    let filter = $('#addressInput').val().toLowerCase();
    foundDrugs.forEach((drug) => {
        if (!filter || drug[2].toLowerCase().indexOf(filter) != -1) $('#results').append(`<div class=drugNormal>${drug[0]}<br/>${drug[1]} руб.<br/>${drug[2]}<hr/></div>`);
    });
}

$('#addressFilter').on('click', () => redraw());

window.onerror = (msg, url, lineNo, columnNo, error) => {
    $('#results').html(`<b>Что-то пошло не так</b><br/>${error.stack ? error.stack : 'No stack available'}`);
}