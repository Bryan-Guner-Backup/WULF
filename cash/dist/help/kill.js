"use strict";

module.exports =
  "\nUsage: kill [OPTION] pid | jobspec ... or kill -l [sigspec]\nSend a signal to a job.\n\nSend the processes identified by PID or JOBSPEC the signal named by\nSIGSPEC or SIGNUM.  If neither SIGSPEC nor SIGNUM is present, then\nSIGTERM is assumed.\n\n  -s sig         SIG is a signal name\n  -n sig         SIG is a signal number\n  -l [sigspec]   list the signal names; if arguments follow `-l' they\n                 are assumed to be signal numbers for which names\n                 should be listed\n      --help     display this help and exit\n\nExit status:\n  0   if OK,\n  1   if an invalid option is given or an error occurs.\n\nReport kill bugs to <https://github.com/dthree/cash>\nCash home page: <http://cash.js.org/>\n";
