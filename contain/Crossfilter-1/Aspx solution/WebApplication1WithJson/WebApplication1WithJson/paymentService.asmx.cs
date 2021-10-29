using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace WebApplication1WithJson
{
    public class Payment
    {
        public string date;
        public int quantity;
        public int total;
        public int discounts;
        public int refunds;
        public int Tax;
        public string type;
    }
    /// <summary>
    /// Summary description for paymentService
    /// </summary>
    [WebService(Namespace = "http://localhost:2426/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class paymentService : System.Web.Services.WebService
    {
        List<Payment> Payments = new List<Payment>{
        new Payment{date= "2011-11-14T16:28:54Z", quantity= 1, total= 300, discounts= 200, refunds=0, Tax=0, type= "visa"},
        new Payment{date= "2011-11-14T16:17:54Z", quantity= 2, total= 190, discounts= 100, refunds=0, Tax=0, type= "tab"},
		new Payment{date= "2011-11-14T16:20:19Z", quantity= 2, total= 190, discounts= 100, refunds=0, Tax=0, type= "tab"},
		new Payment{date= "2011-11-14T16:28:54Z", quantity= 1, total= 300, discounts= 200, refunds=0, Tax=0, type= "visa"},
		new Payment{date= "2011-11-14T16:30:43Z", quantity= 2, total= 90, discounts= 0, refunds=0, Tax=0, type= "tab"},
		new Payment{date= "2011-11-14T16:48:46Z", quantity= 2, total= 90, discounts= 0, refunds=0, Tax=0, type= "tab"},
		new Payment{date= "2011-11-14T16:53:41Z", quantity= 2, total= 90, discounts= 0, refunds=0, Tax=0, type= "tab"},
		new Payment{date= "2011-11-14T16:54:06Z", quantity= 1, total= 100, discounts= 0, refunds=0, Tax=0, type= "cash"},
		new Payment{date= "2011-11-14T16:58:03Z", quantity= 2, total= 90, discounts= 0, refunds=0, Tax=0, type= "tab"},
		new Payment{date= "2011-11-14T17:07:21Z", quantity= 2, total= 90, discounts= 0, refunds=0, Tax=0, type= "tab"},
		new Payment{date= "2011-11-14T17:29:52Z", quantity= 1, total= 200, discounts= 100, refunds=0, Tax=0, type= "visa"},
		new Payment{date= "2011-11-14T12:22:59Z", quantity= 2, total= 90, discounts= 0, refunds=0, Tax=0, type= "tab"},
		new Payment{date= "2011-11-14T13:25:45Z", quantity= 2, total= 200, discounts= 0, refunds=0, Tax=0, type= "cash"},
		new Payment{date= "2011-11-15T17:29:52Z", quantity= 1, total= 200, discounts= 100, refunds=0, Tax=0, type= "visa"},
		new Payment{date= "2011-11-17T16:17:54Z", quantity= 2, total= 190, discounts= 100, refunds=0, Tax=0, type= "tab"},
		new Payment{date= "2011-11-20T16:20:19Z", quantity= 2, total= 190, discounts= 100, refunds=0, Tax=0, type= "tab"},
		new Payment{date= "2011-11-21T16:17:54Z", quantity= 2, total= 1000, discounts= 100, refunds=0, Tax=0, type= "tab"},
		new Payment{date= "2011-11-22T16:20:19Z", quantity= 2, total= 700, discounts= 100, refunds=0, Tax=0, type= "tab"}
        };

        [WebMethod]
        public List<Payment> GetAllPayment()
        {
            return Payments;
;
        }

       
    }
}
