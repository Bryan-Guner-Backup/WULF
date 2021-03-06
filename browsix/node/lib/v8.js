// Copyright (c) 2014, StrongLoop Inc.
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

"use strict";

var v8binding = process.binding("v8");

var heapStatisticsBuffer = new Uint32Array(v8binding.heapStatisticsArrayBuffer);

var kTotalHeapSizeIndex = v8binding.kTotalHeapSizeIndex;
var kTotalHeapSizeExecutableIndex = v8binding.kTotalHeapSizeExecutableIndex;
var kTotalPhysicalSizeIndex = v8binding.kTotalPhysicalSizeIndex;
var kTotalAvailableSize = v8binding.kTotalAvailableSize;
var kUsedHeapSizeIndex = v8binding.kUsedHeapSizeIndex;
var kHeapSizeLimitIndex = v8binding.kHeapSizeLimitIndex;

exports.getHeapStatistics = function () {
  var buffer = heapStatisticsBuffer;

  v8binding.updateHeapStatisticsArrayBuffer();

  return {
    total_heap_size: buffer[kTotalHeapSizeIndex],
    total_heap_size_executable: buffer[kTotalHeapSizeExecutableIndex],
    total_physical_size: buffer[kTotalPhysicalSizeIndex],
    total_available_size: buffer[kTotalAvailableSize],
    used_heap_size: buffer[kUsedHeapSizeIndex],
    heap_size_limit: buffer[kHeapSizeLimitIndex],
  };
};

exports.setFlagsFromString = v8binding.setFlagsFromString;
