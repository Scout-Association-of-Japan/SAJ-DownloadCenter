// チェックボタンでリンクactive切り替え
$('#cb-agree').change(function(){
	if ($(this).is(':checked')) {
		$('.btn').removeClass('disabled');
	} else {
		$('.btn').addClass('disabled');
	}
});