using System;
using NUnit.Framework;
using System.Drawing;
using NUnit.Framework.Constraints;

namespace OpenQA.Selenium
{
    [TestFixture]
    public class JavascriptEnabledBrowserTest : DriverTestFixture
    {
        [Test]
        [Category("Javascript")]
        public void DocumentShouldReflectLatestTitle()
        {
            driver.Url = javascriptPage;

            Assert.AreEqual("Testing Javascript", driver.Title);
            driver.FindElement(By.LinkText("Change the page title!")).Click();
            Assert.AreEqual("Changed", driver.Title);
        }

        [Test]
        [Category("Javascript")]
        public void DocumentShouldReflectLatestDom()
        {
            driver.Url = javascriptPage;
            String currentText = driver.FindElement(By.XPath("//div[@id='dynamo']")).Text;
            Assert.AreEqual("What's for dinner?", currentText);

            IWebElement element = driver.FindElement(By.LinkText("Update a div"));
            element.Click();

            String newText = driver.FindElement(By.XPath("//div[@id='dynamo']")).Text;
            Assert.AreEqual("Fish and chips!", newText);
        }

        [Test]
        [Category("Javascript")]
        [IgnoreBrowser(Browser.IPhone, "does not detect that a new page loaded.")]
        public void ShouldWaitForLoadsToCompleteAfterJavascriptCausesANewPageToLoad()
        {
            driver.Url = formsPage;

            driver.FindElement(By.Id("changeme")).Click();
            WaitFor(() => { return driver.Title == "Page3"; }, "Browser title was not 'Page3'");
            Assert.AreEqual("Page3", driver.Title);
        }

        [Test]
        [Category("Javascript")]
        [IgnoreBrowser(Browser.IPhone, "does not detect that a new page loaded.")]
        public void ShouldBeAbleToFindElementAfterJavascriptCausesANewPageToLoad()
        {
            driver.Url = formsPage;

            driver.FindElement(By.Id("changeme")).Click();

            WaitFor(() => { return driver.Title == "Page3"; }, "Browser title was not 'Page3'");
            Assert.AreEqual("3", driver.FindElement(By.Id("pageNumber")).Text);
        }

        [Test]
        [Category("Javascript")]
        public void ShouldBeAbleToDetermineTheLocationOfAnElement()
        {
            driver.Url = xhtmlTestPage;

            IWebElement element = driver.FindElement(By.Id("username"));
            Point location = element.Location;

            Assert.Greater(location.X, 0);
            Assert.Greater(location.Y, 0);
        }

        [Test]
        [Category("Javascript")]
        public void ShouldBeAbleToDetermineTheSizeOfAnElement()
        {
            driver.Url = xhtmlTestPage;

            IWebElement element = driver.FindElement(By.Id("username"));
            Size size = element.Size;

            Assert.Greater(size.Width, 0);
            Assert.Greater(size.Height, 0);
        }

        [Test]
        [Category("Javascript")]
        [IgnoreBrowser(Browser.IPhone, "sendKeys not implemented correctly")]
        public void ShouldFireOnChangeEventWhenSettingAnElementsValue()
        {
            driver.Url = javascriptPage;
            driver.FindElement(By.Id("change")).SendKeys("foo");
            String result = driver.FindElement(By.Id("result")).Text;

            Assert.AreEqual("change", result);
        }

        [Test]
        [Category("Javascript")]
        public void ShouldBeAbleToSubmitFormsByCausingTheOnClickEventToFire()
        {
            driver.Url = javascriptPage;
            IWebElement element = driver.FindElement(By.Id("jsSubmitButton"));
            element.Click();

            WaitFor(() => { return driver.Title == "We Arrive Here"; }, "Browser title was not 'We Arrive Here'");
            Assert.AreEqual("We Arrive Here", driver.Title);
        }

        [Test]
        [Category("Javascript")]
        public void ShouldBeAbleToClickOnSubmitButtons()
        {
            driver.Url = javascriptPage;
            IWebElement element = driver.FindElement(By.Id("submittingButton"));
            element.Click();

            WaitFor(() => { return driver.Title == "We Arrive Here"; }, "Browser title was not 'We Arrive Here'");
            Assert.AreEqual("We Arrive Here", driver.Title);
        }

        [Test]
        [Category("Javascript")]
        public void Issue80ClickShouldGenerateClickEvent()
        {
            driver.Url = javascriptPage;
            IWebElement element = driver.FindElement(By.Id("clickField"));
            Assert.AreEqual("Hello", element.GetAttribute("value"));

            element.Click();

            Assert.AreEqual("Clicked", element.GetAttribute("value"));
        }

        [Test]
        [Category("Javascript")]
        [IgnoreBrowser(Browser.IPhone, "iPhone: focus doesn't change as expected")]
        public void ShouldBeAbleToSwitchToFocusedElement()
        {
            driver.Url = javascriptPage;

            driver.FindElement(By.Id("switchFocus")).Click();

            IWebElement element = driver.SwitchTo().ActiveElement();
            Assert.AreEqual("theworks", element.GetAttribute("id"));
        }

        [Test]
        [Category("Javascript")]
        public void IfNoElementHasFocusTheActiveElementIsTheBody()
        {
            driver.Url = simpleTestPage;

            IWebElement element = driver.SwitchTo().ActiveElement();

            Assert.AreEqual("body", element.GetAttribute("name"));
        }

        [Test]
        [Category("Javascript")]
        [IgnoreBrowser(Browser.Firefox, "Window demands focus to work.")]
        [IgnoreBrowser(Browser.Safari, "Window demands focus to work.")]
        public void ChangeEventIsFiredAppropriatelyWhenFocusIsLost()
        {
            driver.Url = javascriptPage;

            IWebElement input = driver.FindElement(By.Id("changeable"));
            input.SendKeys("test");
            driver.FindElement(By.Id("clickField")).Click(); // move focus
            EqualConstraint firstConstraint = new EqualConstraint("focus change blur");
            EqualConstraint secondConstraint = new EqualConstraint("focus change blur");


            Assert.That(driver.FindElement(By.Id("result")).Text.Trim(), firstConstraint | secondConstraint);

            input.SendKeys(Keys.Backspace + "t");
            driver.FindElement(By.Id("clickField")).Click();  // move focus

            firstConstraint = new EqualConstraint("focus change blur focus blur");
            secondConstraint = new EqualConstraint("focus blur change focus blur");
            EqualConstraint thirdConstraint = new EqualConstraint("focus blur change focus blur change");
            EqualConstraint fourthConstraint = new EqualConstraint("focus change blur focus change blur"); //What Chrome does
            // I weep.
            Assert.That(driver.FindElement(By.Id("result")).Text.Trim(),
                       firstConstraint | secondConstraint | thirdConstraint | fourthConstraint);
        }

        /**
         * If the click handler throws an exception, the firefox driver freezes. This is suboptimal.
         */
        [Test]
        [Category("Javascript")]
        public void ShouldBeAbleToClickIfEvenSomethingHorribleHappens()
        {
            driver.Url = javascriptPage;

            driver.FindElement(By.Id("error")).Click();

            // If we get this far then the test has passed, but let's do something basic to prove the point
            String text = driver.FindElement(By.Id("error")).Text;

            Assert.IsNotNull(text);
        }

        [Test]
        [Category("Javascript")]
        public void ShouldBeAbleToGetTheLocationOfAnElement()
        {
            driver.Url = javascriptPage;

            if (!(driver is IJavaScriptExecutor))
            {
                return;
            }

            ((IJavaScriptExecutor)driver).ExecuteScript("window.focus();");
            IWebElement element = driver.FindElement(By.Id("keyUp"));

            if (!(element is ILocatable))
            {
                return;
            }

            Point point = ((ILocatable)element).LocationOnScreenOnceScrolledIntoView;

            Assert.Greater(point.X, 1);
            Assert.GreaterOrEqual(point.Y, 0);
        }

        [Test]
        [Category("Javascript")]
        [NeedsFreshDriver(IsCreatedAfterTest = true)]
        [IgnoreBrowser(Browser.Safari, "Safari: issue 3693")]
        [IgnoreBrowser(Browser.Opera)]
        [IgnoreBrowser(Browser.IPhone)]
        [IgnoreBrowser(Browser.WindowsPhone, "Windows Phone driver does not support multiple windows")]
        public void ShouldBeAbleToClickALinkThatClosesAWindow()
        {
            if (TestUtilities.IsMarionette(driver))
            {
                Assert.Ignore("Marionette hangs the browser in this case");
            }

            driver.Url = javascriptPage;

            String handle = driver.CurrentWindowHandle;
            driver.FindElement(By.Id("new_window")).Click();
            WaitFor(() => { driver.SwitchTo().Window("close_me"); return true; }, "Could not find window with name 'close_me'");

            driver.FindElement(By.Id("close")).Click();

	        driver.SwitchTo().Window(handle);
        }
    }
}
