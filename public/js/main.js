$(document).ready(function(){
    $('.delete-activity').on('click', function(){
        var id = $(this).data('id');
        var url = '/delete/' + id;
        if(confirm('Delete Activity?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting Activity...');
                    window.location.href='/';
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    });

    $('.edit-activity').on('click', function() {
        $('#edit-form-description').val($(this).data('description'));
        $('#edit-form-id').val($(this).data('id'));
    });
});