const ul = document.getElementById('people');
fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(data => {
        let people = data;
        return people.map(function(person) {
            let node = document.createElement("li");
			node.innerHTML = '<h3>' + person.name + '</h3>';
			node.innerHTML += '<span>' + person.email + '</span>';
			node.innerHTML += '<span>' + person.phone + '</span>';
			document.getElementById("people").appendChild(node);	
        });
    })