// Copyright 2011 Software Freedom Conservancy
// Copyright 2011 Google Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using NUnit.Framework;
using OpenQA.Selenium.Remote;

namespace OpenQA.Selenium
{
    [TestFixture]
    public class DesiredCapabilitiesTests
    {
        [Test]
        public void ShouldGetPlatformFromDesiredCapabilities()
        {
            var platform = new Platform(PlatformType.Windows);
            var capabilities = new DesiredCapabilities(null, null, platform);
            Assert.AreEqual(platform.PlatformType, capabilities.Platform.PlatformType);
        }
    }
}
