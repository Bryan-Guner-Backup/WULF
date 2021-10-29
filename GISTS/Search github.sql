-- https://bigquery.cloud.google.com/

SELECT
  s.stars,
  f.repo_name,
  f.path
FROM 
	(SELECT 
	  id
	FROM 
		[bigquery-public-data:github_repos.contents]
	WHERE 
	   REGEXP_MATCH( content , r'^\#\!\/usr\/bin\/env iojs')    
	) c 
	JOIN 
	[bigquery-public-data:github_repos.files]  f
		ON
		f.id = c.id
  JOIN 
   (    SELECT repo.name as repo_name, COUNT(*) as stars
    FROM TABLE_DATE_RANGE([githubarchive:day.], TIMESTAMP('2015-01-01'), TIMESTAMP('2016-12-31'))
    WHERE type = "WatchEvent"
    GROUP BY repo_name
     ) s
    ON
    s.repo_name = f.repo_name
where 
	  REGEXP_MATCH(path, r'src/.+?\.js$') 
	  AND
    NOT REGEXP_MATCH(path, r'min\.js|libs?|jquery|node_modules'
)

order by s.stars DESC