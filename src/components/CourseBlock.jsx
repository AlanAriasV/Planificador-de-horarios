const CourseBlock = ({ code, title }) => {
    return (
      <div className="schedule-block bg-light border border-2 border-secondary rounded p-2 justify-content-center align-items-center">
        <div className="schedule-block-code text-center text-secondary">{code}</div>
        <div className="schedule-block-title text-center">{title}</div>
      </div>
    );
  };
  
  export default CourseBlock;