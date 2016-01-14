var batterPlayers = {};
['black', 'gold', 'purple', 'red', 'yellow', 'blue'].forEach(function(el) {
	var title;
	switch (el) {
		case 'blue':
			title = '藍卡';
			break;
		case 'yellow':
			title = '黃卡';
			break;
		case 'red':
			title = '紅卡';
			break;
		case 'purple':
			title = '紫卡';
			break;
		case 'gold':
			title = '金卡';
			break;
		case 'black':
			title = '黑卡';
			break;
	}

	var table = $('<table class="ui celled table"><thead><tr><th>年</th><th>姓名</th><th>球隊</th><th>卡色</th><th>位置</th><th>打擊方式</th><th>屬性</th><th>升級</th><th>力量</th><th>打擊</th><th>速度</th><th>傳球</th><th>守備</th><th>總合</th></tr></thead><tbody id="' + el + '_batter_table"></tbody></table>');
	$('#platform').append($('<h2 class="ui header">' + title + '</h2>'));
	$('#platform').append(table);

	batterPlayers[el] = [];
});

$.ajax({
	url: './data/batter.json',
	async: true,
	dataType: "json"
}).done(function(json) {
	json.forEach(function(jn) {
		var className;
		switch (jn.卡色) {
			case '藍':
				className = 'blue';
				break;
			case '黃':
				className = 'yellow';
				break;
			case '紅':
				className = 'red';
				break;
			case '紫':
				className = 'purple';
				break;
			case '金':
				className = 'gold';
				break;
			case '黑':
				className = 'black';
				break;
		}
		batterPlayers[className].push(jn);
	});

	for (var color in batterPlayers) {
		var batterPlayer = batterPlayers[color];
		var tbodyInnerHTML = '';
		batterPlayer.forEach(function(bp) {
			var tr = '<tr class="' + color + '">';
			["年", "姓名", "球隊", "卡色", "位置", "打擊方式", "屬性", "升級", "力量", "打擊", "速度", "傳球", "守備", "總合"].forEach(function(el) {
				tr += ('<td>' + bp[el] + '</td>');
			});
			tr += '</tr>';
			tbodyInnerHTML += tr;
		});
		var tbody = document.getElementById(color + '_batter_table');
		tbody.innerHTML = tbodyInnerHTML;
	}
});

$('.list .master.checkbox')
	.checkbox({
		// check all children
		onChecked: function() {
			var
				$childCheckbox = $(this).closest('.checkbox').siblings('.list').find('.checkbox');
			$childCheckbox.checkbox('check');
		},
		// uncheck all children
		onUnchecked: function() {
			var
				$childCheckbox = $(this).closest('.checkbox').siblings('.list').find('.checkbox');
			$childCheckbox.checkbox('uncheck');
		}
	});

$('.list .child.checkbox')
	.checkbox({
		// Fire on load to set parent value
		fireOnInit: true,
		// Change parent state on each child checkbox change
		onChange: function() {
			var
				$listGroup = $(this).closest('.list'),
				$parentCheckbox = $listGroup.closest('.item').children('.checkbox'),
				$checkbox = $listGroup.find('.checkbox'),
				allChecked = true,
				allUnchecked = true;
			// check to see if all other siblings are checked or unchecked
			$checkbox.each(function() {
				if ($(this).checkbox('is checked')) {
					allUnchecked = false;
					$('#' + $('input', this).attr('name') + '_batter_table').show();
				} else {
					allChecked = false;
					$('#' + $('input', this).attr('name') + '_batter_table').hide();
				}
			});
			// set parent checkbox state, but dont trigger its onChange callback
			if (allChecked) {
				$parentCheckbox.checkbox('set checked');
			} else if (allUnchecked) {
				$parentCheckbox.checkbox('set unchecked');
			} else {
				$parentCheckbox.checkbox('set indeterminate');
			}
		}
	});

$('.list .master.checkbox').click();

$('#search_player').keypress(function(e) {
	if (e.which == 13) {
		var value = $('#search_player').val();
		if (isNaN(parseFloat(value))) {
			$('tbody').each(function() {
				if (this.display !== 'none') {
					$('tr', this).each(function() {
						var check = false;
						$('td', this).each(function() {
							if ($(this).text().search(value) !== -1) {
								check = true;
							}
						});

						if (check) {
							$(this).show();
						} else {
							$(this).hide();
						}
					});
				}
			});
		}
		return false;
	}
});