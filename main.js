
if (import.meta.main) {
  Deno.readTextFile("./input.tars").then((data) => {
    console.log(data);
  });
}
