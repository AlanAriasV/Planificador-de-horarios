const CourseBlock = ({ code, title }) => {
    return (
      <div className="schedule-block">
        <div className="schedule-block-code">{code}</div>
        <div className="schedule-block-title">{title}</div>
      </div>
    );
  };
  
  export default CourseBlock;