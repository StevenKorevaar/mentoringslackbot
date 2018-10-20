module.exports = {
    msgContains: function (message, string) {
      return message.text.toLowerCase().indexOf(string) > -1
    }
}