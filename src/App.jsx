if (route === "menu") {
  return (
    <>
      <div style={{position:'fixed', top:10, right:10, zIndex:9999, background:'#ff0', color:'#000', padding:'6px 10px', borderRadius:8}}>
        BUILD LOCAL OK
      </div>
      <Menu onOpen={openSection} />
    </>
  );
}