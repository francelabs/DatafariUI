import React from 'react';
import DOMPurify from 'dompurify';

const SafeComponent = ({ htmlContent }) => {
    const cleanHTML = DOMPurify.sanitize(htmlContent);

    return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
};

export default SafeComponent;
