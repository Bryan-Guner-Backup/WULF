// <copyright file="ErrorEventArgs.cs" company="WebDriver Committers">
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
    /// Provides arguments for handling events associated with errors.
    /// </summary>
    public class ErrorEventArgs : EventArgs
    {
        private Exception exception;

        /// <summary>
        /// Initializes a new instance of the <see cref="ErrorEventArgs"/> class.
        /// </summary>
        /// <param name="exception">The <see cref="Exception"/> thrown for the error condition.</param>
        public ErrorEventArgs(Exception exception)
        {
            this.exception = exception;
        }

        /// <summary>
        /// Gets the <see cref="Exception"/> associated with the error condition.
        /// </summary>
        public Exception Exception
        {
            get { return this.exception; }
        }
    }
}
