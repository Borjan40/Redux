const InpField = ({ title, handleInput, handleSubmit }) => {
    return (
      <label>
        <input value={title} onChange={(e) => handleInput(e.target.value)} />
        <button onClick={handleSubmit}>Add Todo</button>
      </label>
    );
  };
  
  export default InpField;
  