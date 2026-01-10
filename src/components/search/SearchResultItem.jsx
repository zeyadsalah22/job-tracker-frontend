import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building, Users, HelpCircle, Building2 } from 'lucide-react';

export default function SearchResultItem({ result, category, onSelect, isSelected }) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (category) {
      case 'applications':
        return <Briefcase className="w-5 h-5 text-primary" />;
      case 'companies':
        return <Building className="w-5 h-5 text-blue-600" />;
      case 'userCompanies':
        return <Building2 className="w-5 h-5 text-green-600" />;
      case 'employees':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'questions':
        return <HelpCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Briefcase className="w-5 h-5" />;
    }
  };

  const getTitle = () => {
    switch (category) {
      case 'applications':
        return result.jobTitle || 'Untitled Application';
      case 'companies':
        return result.name || 'Unnamed Company';
      case 'userCompanies':
        return result.companyName || 'Unnamed Company';
      case 'employees':
        return result.name || 'Unnamed Employee';
      case 'questions':
        const questionText = result.question || result.question1 || 'Untitled Question';
        // Truncate to 80 characters
        return questionText.length > 80 
          ? questionText.substring(0, 80) + '...' 
          : questionText;
      default:
        return 'Unknown';
    }
  };

  const getSubtitle = () => {
    switch (category) {
      case 'applications':
        return result.companyName || 'Unknown Company';
      case 'companies':
        return result.location || result.industry || 'Company';
      case 'userCompanies':
        return result.companyLocation || result.industry || 'Your Company';
      case 'employees':
        return result.jobTitle || result.department || 'Employee';
      case 'questions':
        return result.category || result.difficulty || 'Question';
      default:
        return '';
    }
  };

  const getMetadata = () => {
    switch (category) {
      case 'applications':
        return result.stage || result.status || '';
      case 'companies':
        return result.size || '';
      case 'userCompanies':
        return result.notes ? 'Has notes' : '';
      case 'employees':
        return result.email || '';
      case 'questions':
        return result.type || '';
      default:
        return '';
    }
  };

  const getNavigationPath = () => {
    // Navigate to list pages with ID query param to auto-open modal
    switch (category) {
      case 'applications':
        return `/applications?view=${result.applicationId || result.id}`;
      case 'companies':
        return `/companies?view=${result.companyId || result.id}`;
      case 'userCompanies':
        return `/user-companies?view=${result.companyId || result.id}`;
      case 'employees':
        return `/employees?view=${result.employeeId || result.id}`;
      case 'questions':
        return `/questions?view=${result.questionId || result.id}`;
      default:
        return '/';
    }
  };

  const handleClick = () => {
    const path = getNavigationPath();
    navigate(path);
    if (onSelect) onSelect();
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-primary/10 ring-2 ring-primary' 
          : 'hover:bg-gray-50'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleClick();
      }}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {getTitle()}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {getSubtitle()}
        </p>
        {getMetadata() && (
          <p className="text-xs text-gray-400 mt-0.5">
            {getMetadata()}
          </p>
        )}
      </div>
    </div>
  );
}

