<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="WebApplication1WithJson.Index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <input type="button" id="Button1" value="Get Cars" />
    <div id="output"></div>
    </form>
    <script type="text/javascript" src="Scripts/jquery-1.8.2.min.js"></script>
    <script type="text/javascript">
    $(function () {
        $('#Button1').click(getCars);
    });

    function getCars() {
        $.ajax({
            type: "POST",
            url: "CarService.asmx/GetAllCars",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var cars = response.d;
                $('#output').empty();
                $.each(cars, function (index, car) {
                    $('#output').append('<p><strong>' + car.Make + ' ' +
                                          car.Model + '</strong><br /> Year: ' +
                                          car.Year + '<br />Doors: ' +
                                          car.Doors + '<br />Colour: ' +
                                          car.Colour + '<br />Price: £' +
                                          car.Price + '</p>');
                });
            },

            failure: function (msg) {
                $('#output').text(msg);
            }
        });
    }
</script>
</body>
</html>
