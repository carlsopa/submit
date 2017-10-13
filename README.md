<h3><b>When is the next bus, and what is the weather like</b></h3>
Part of a larger ongoing project, this is a simple demonstration utilizing several techniques to gather and display data. I am obtaining data from a local SQL database server, as well as several APIs. I obviously used the most famous D.C. address, but you could use any address that is served by the DC Metro bus system.

<br>Flow of data
<ol>
<li>Address is entered and submitted</li>
<li>Address is sent to the Google API to obtain latitude and longitude</li>
<li>Latitude and longitude are then submitted to a DC Metro API to get the closest stations</li>
<li>Closest stations are then used to determine nearest buses</li>
<li>Latitude and longitude are also used to pull the current weather temp from weather.com API</li>
</ol></p>
<p>The menu items are pulled from the SQL server and displayed.</p>
<br>To see an example: <a href="http://www.carlsondigitalsigns.com/adressfrm.html">Click Here!</a>
