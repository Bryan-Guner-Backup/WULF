data division.linkage section.01 global.01 require.procedure division.local mysql.perform require using "mysql" giving mysql.local options.move object to options.move "root" to user in options.move "" to password in options.local connection.perform createConnection in mysql using options giving connection.perform query in connection using "show databases" showdbs.showdbs section using err, rows, fields.if err then     display err    stop runend-if.local k.local n.move length in rows to n.local row.perform varying k from 1 to n    move rows(k) to row    display Database in rowend-perform.stop run.