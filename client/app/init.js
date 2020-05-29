export const init = async () => {
  const res = await fetch("/api/participants");
  const data = await res.json();
  //console.log(data);
  const ul = document.createElement("ul");
  for (let participants of data) {
    const li = document.createElement("li");
    const participantsId = JSON.stringify(participants.id).split('"').join("");
    const participantsName = JSON.stringify(participants.firstName)
      .split('"')
      .join("");
    const participantsLastName = JSON.stringify(participants.lastName)
      .split('"')
      .join("");
    li.textContent = `${participantsId} ${participantsName} ${participantsLastName}`;
    ul.appendChild(li);
  }
  const Allbutton = document.createElement("button");
  Allbutton.textContent = "all APPLICANTS";
  Allbutton.classList.add("btn");
  Allbutton.classList.add("btn-outline-primary");
  Allbutton.classList.add("btn-block");
  const div = document.getElementById("output");
  div.appendChild(Allbutton);
  div.appendChild(ul);
};
