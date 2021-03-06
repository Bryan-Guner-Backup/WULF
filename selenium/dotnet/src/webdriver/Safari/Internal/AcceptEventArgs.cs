// <copyright file="AcceptEventArgs.cs" company="WebDriver Committers">
// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements. See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership. The SFC licenses this file
// to you under the Apache License, Version 2.0 (the "License");
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
// </copyright>

using System;

namespace OpenQA.Selenium.Safari.Internal
{
    /// <summary>
    /// Provides arguments for handling the event for accepting connections.
    /// </summary>
    public class AcceptEventArgs : EventArgs
    {
        private ISocket socket;

        /// <summary>
        /// Initializes a new instance of the <see cref="AcceptEventArgs"/> class.
        /// </summary>
        /// <param name="socket">The <see cref="ISocket"/> to use in the event.</param>
        public AcceptEventArgs(ISocket socket)
        {
            this.socket = socket;
        }

        /// <summary>
        /// Gets the <see cref="ISocket"/> object to use in handling the event.
        /// </summary>
        public ISocket Socket
        {
            get { return this.socket; }
        }
    }
}
