if (localStorage.getItem('fav') === null) localStorage.setItem('fav', '');
var favs = localStorage.getItem('fav').split(';');
if (localStorage.getItem('fav') == '') $('#favs').text('Нет избранных аптек');
else {
    $('#favs').text('');
    favs.forEach((addr) => {
        $('#favs').append('<div><span>' + addr + '</span><button>Удалить</button></div>');
    });
}
$('#favs button').click((e) => {
    e = $(e.target);
    let addr = $('span', e.closest('div')).text();
    e.closest('div').remove();
    favs.splice(favs.indexOf(addr, 1));
    localStorage.setItem('fav', favs.join(';'));
    location.reload();
});

$.get('https://cors.io?http://apteka-omsk.ru/our-pharmacy', (raw) => {
    let dom = $.parseHTML(raw);
    $('#allPharm').html('');
    let addresses = [];
    $('.views-row h2 a', dom).get().forEach((el) => {
        addresses.push($(el).text());
    });
    console.log(addresses);
    addresses.forEach((addr) => {
        if (favs.indexOf(addr) == -1) $('#allPharm').append('<div><span>' + addr + '</span><button>Добавить</button></div>');
    });
    $('#allPharm button').click((e) => {
        e = $(e.target);
        let addr = $('span', e.closest('div')).text();
        e.closest('div').remove();
        //let cfavs = localStorage.getItem('fav').split(';');
        if (!(favs.length == 1 && favs[0] == '')) favs.push(addr);
        else favs = [addr];
        localStorage.setItem('fav', favs.join(';'));
        location.reload();
    });
});
//