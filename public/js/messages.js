// To load the reply page
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('replyForm').addEventListener('submit', function(event) {
      var messageId = document.getElementById('messageIdInput').value;
      this.action = '/reply/' + messageId;
    });
  });

document.getElementById('replyForm').addEventListener('submit', function() {
    let originalMessage = '<%= messageData.message_body %>';
    document.getElementById('message_body').value = `Original Message: \n\n<em>${originalMessage}</em>\n\n` + document.getElementById('message_body').value;
});