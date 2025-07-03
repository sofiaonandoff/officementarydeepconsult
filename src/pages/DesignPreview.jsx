import { useLocation, useNavigate } from 'react-router-dom';
import { exportOfficeData } from '../services/officeDataService';
import { sendOfficeDataEmail } from '../services/emailService';
import '../styles/DesignPreview.css';

const DesignPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;

  // 업무형태 라벨 변환 함수(컴포넌트 상단에 선언)
  const getWorkStyleLabel = (id) => ({
    'startup': '스타트업',
    'finance': '재무/금융',
    'tech': 'IT/기술',
    'creative': '크리에이티브',
    'consulting': '컨설팅',
    'research': '연구/개발',
    'marketing': '마케팅',
    'general': '일반 사무',
    'other': formData?.workStyleOther || '기타'
  }[id] || id);

  const handleSubmitData = async () => {
    try {
      // 이메일 템플릿에 맞는 데이터 구성
      const emailData = {
        company_name: formData?.companyName || '',
        contact_name: formData?.contactName || '',
        contact_phone: formData?.contactPhone || '',
        from_email: formData?.contactEmail || '',
        space_size: formData?.spaceSize ? `${formData.spaceSize}평` : '',
        total_employees: formData?.totalEmployees ? `${formData.totalEmployees}명` : '',
        budget: formData?.budget || '',
        start_schedule: formData?.startSchedule ? formData.startSchedule : '미정',
        end_schedule: formData?.endSchedule ? formData.endSchedule : '미정',
        work_style: (formData?.workStyle || []).map(getWorkStyleLabel).filter(Boolean).join(', '),
        seating_type: formData?.seatingType === 'fixed' ? '고정좌석제' : '자율좌석제',
        work_style_flexibility: {
          'high': '매우 유연',
          'medium': '중간',
          'low': '제한적'
        }[formData?.workStyleFlexibility] || '',
        workstations: formData?.workstations ? `${formData.workstations.count || 0}개 (${formData.workstations.size || ''}cm)` : '0개',
        lockers: formData?.lockers ? `${formData.lockers.count || 0}개` : '0개',
        focus_rooms_single: formData?.focusRooms?.single ? `${formData.focusRooms.single.count || 0}개` : '0개',
        focus_rooms_double: formData?.focusRooms?.double ? `${formData.focusRooms.double.count || 0}개` : '0개',
        executive_rooms: formData?.executiveRooms ? `${formData.executiveRooms.count || 0}개` : '0개',
        meeting_rooms_small: formData?.meetingRooms?.small ? `${formData.meetingRooms.small.count || 0}개` : '0개',
        meeting_rooms_medium: formData?.meetingRooms?.medium ? `${formData.meetingRooms.medium.count || 0}개` : '0개',
        meeting_rooms_large: formData?.meetingRooms?.large ? `${formData.meetingRooms.large.count || 0}개` : '0개',
        meeting_rooms_conference: formData?.meetingRooms?.conference ? `${formData.meetingRooms.conference.count || 0}개` : '0개',
        additional_spaces: Object.entries(formData?.additionalSpaces || {})
          .filter(([_, space]) => space?.required)
          .map(([type, space]) => {
            const spaceName = {
              'canteen': '캔틴',
              'lounge': '라운지',
              'breakRoom': '휴게실',
              'storage': '창고',
              'exhibition': '전시공간',
              'serverRoom': '서버실',
              'other': '기타'
            }[type] || type;
            return `- ${spaceName}${space?.size ? ` (${space.size})` : ''}`;
          })
          .join('\n')
      };

      await sendOfficeDataEmail(emailData);
      alert('감사합니다. 빠른 시일 내에 담당자가 확인 후 연락드릴 예정입니다.');
    } catch (error) {
      console.error('데이터 제출 중 오류 발생:', error);
      alert(error.message || '데이터 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleGoBack = () => {
    // formData가 있는지 확인하고, 없으면 기본값 설정
    const dataToPass = formData || {
      companyName: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      spaceSize: '',
      totalEmployees: '',
      budget: '',
      startSchedule: '',
      endSchedule: '',
      seatingType: '',
      workStyle: [],
      workStyleFlexibility: '',
      workstations: { count: 0, size: '140x70' },
      lockers: { count: 0 },
      focusRooms: { single: { count: 0 }, double: { count: 0 } },
      executiveRooms: { count: 0 },
      meetingRooms: {
        small: { count: 0 },
        medium: { count: 0 },
        large: { count: 0 },
        conference: { count: 0 }
      },
      additionalSpaces: {
        canteen: { required: false, size: '' },
        lounge: { required: false, size: '' },
        breakRoom: { required: false, size: '' },
        storage: { required: false, size: '' },
        exhibition: { required: false, size: '' },
        serverRoom: { required: false, size: '' },
        other: { required: false, size: '' }
      }
    };

    // 데이터를 문자열로 변환했다가 다시 파싱하여 깊은 복사 수행
    const deepCopiedData = JSON.parse(JSON.stringify(dataToPass));

    // replace: true를 사용하여 브라우저 히스토리에 새 항목을 추가하지 않음
    navigate('/initial-info', {
      state: {
        formData: deepCopiedData,
        fromPreview: true
      },
      replace: true
    });
  };

  const generateCSV = (data) => {
    const rows = [
      ['구분', '항목', '내용'],
      ['기본 정보', '회사명', data.companyName],
      ['', '담당자', data.contactName],
      ['', '연락처', data.contactPhone],
      ['', '이메일', data.contactEmail],
      ['규모 및 예산 범위', '공간 크기', `${data.spaceSize}평`],
      ['', '총 인원', `${data.totalEmployees}명`],
      ['', '예산 범위', data.budget],
      ['', '시작 일정', data.startSchedule ? data.startSchedule : '미정'],
      ['', '완료 일정', data.endSchedule ? data.endSchedule : '미정'],
      ['업무 공간 설정', '업무 형태', (data.workStyle || []).map(getWorkStyleLabel).filter(Boolean).join(', ')],
      ['', '좌석제도', data.seatingType === 'fixed' ? '고정좌석제' : '자율좌석제'],
      ['', '업무 공간 유연성', {
        'high': '매우 유연',
        'medium': '중간',
        'low': '제한적'
      }[data.workStyleFlexibility]],
      ['개인 업무공간', '워크스테이션', `${data.workstations.count}개 (${data.workstations.size}cm)`],
      ['', '개인 락커', `${data.lockers.count}개`],
      ['', '1인 포커스룸', `${data.focusRooms.single.count}개`],
      ['', '2인 포커스룸', `${data.focusRooms.double.count}개`],
      ['', '임원실(사무실)', `${data.executiveRooms.count}개`],
      ['회의실', '소형 회의실(4인)', `${data.meetingRooms.small.count}개`],
      ['', '중형 회의실(6인)', `${data.meetingRooms.medium.count}개`],
      ['', '대형 회의실(8인)', `${data.meetingRooms.large.count}개`],
      ['', '컨퍼런스룸(9인 이상)', `${data.meetingRooms.conference.count}개`]
    ];

    // 추가 공간 정보 추가
    Object.entries(data.additionalSpaces).forEach(([type, space]) => {
      if (space.required) {
        const spaceName = {
          'canteen': '캔틴',
          'lounge': '라운지',
          'breakRoom': '휴게실',
          'storage': '창고',
          'exhibition': '전시공간',
          'serverRoom': '서버실',
          'other': '기타'
        }[type];
        rows.push(['추가 공간', spaceName, space.size || '']);
      }
    });

    // CSV 문자열 생성
    return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  const handleExportCSV = () => {
    try {
      const csvContent = generateCSV(formData);
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${formData.companyName}_오피스_설계_데이터_${new Date().toLocaleDateString()}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV 파일 생성 중 오류 발생:', error);
      alert('CSV 파일 생성 중 오류가 발생했습니다.');
    }
  };

  // handleExportData 함수를 handleExportCSV로 대체
  const handleExportData = handleExportCSV;

  return (
    <div className="design-preview-container">
      <h2>오피스 설계 미리보기</h2>
      <div className="preview-content">
        <div className="preview-section">
          <h2>입력된 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>기본 정보</h3>
              <p className="info-value">회사명: {formData?.companyName}</p>
              <p className="info-value">담당자: {formData?.contactName}</p>
              <p className="info-value">연락처: {formData?.contactPhone}</p>
              <p className="info-value">이메일: {formData?.contactEmail}</p>
            </div>
            <div className="info-item">
              <h3>규모 및 예산 범위</h3>
              <p className="info-value">공간 크기: {formData?.spaceSize}평</p>
              <p className="info-value">오피스 총 인원: {formData?.totalEmployees}명</p>
              <p className="info-value">예산 범위: {formData?.budget}</p>
              <p className="info-value">시작 일정: {formData?.startSchedule ? formData.startSchedule : '미정'}</p>
              <p className="info-value">완료 일정: {formData?.endSchedule ? formData.endSchedule : '미정'}</p>
            </div>
            <div className="info-item">
              <h3>업무 공간 설정</h3>
              <p className="info-value">업무 형태: {
                (formData?.workStyle || [])
                  .map(getWorkStyleLabel)
                  .filter(Boolean)
                  .join(', ')
              }</p>
              <p className="info-value">좌석제도: {formData?.seatingType === 'fixed' ? '고정좌석제' : '자율좌석제'}</p>
              <p className="info-value">업무 공간 유연성: {
                {
                  'high': '매우 유연',
                  'medium': '중간',
                  'low': '제한적'
                }[formData?.workStyleFlexibility]
              }</p>
            </div>
            <div className="info-item">
              <h3>개인 업무공간</h3>
              <p className="info-value">워크스테이션: {formData?.workstations.count}개 ({formData?.workstations.size}cm)</p>
              <p className="info-value">개인 락커: {formData?.lockers.count}개</p>
              <p className="info-value">1인 포커스룸: {formData?.focusRooms.single.count}개</p>
              <p className="info-value">2인 포커스룸: {formData?.focusRooms.double.count}개</p>
              <p className="info-value">임원실(사무실): {formData?.executiveRooms.count}개</p>
            </div>
            <div className="info-item">
              <h3>회의실</h3>
              {Object.entries(formData?.meetingRooms || {}).map(([type, data]) => (
                data.count > 0 && (
                  <p className="info-value" key={type}>
                    {type === 'small' && '소형 회의실'}
                    {type === 'medium' && '중형 회의실'}
                    {type === 'large' && '대형 회의실'}
                    {type === 'conference' && '컨퍼런스룸'}: {data.count}개
                  </p>
                )
              ))}
            </div>
            <div className="info-item">
              <h3>추가 공간</h3>
              {Object.entries(formData?.additionalSpaces || {}).map(([type, data]) => (
                data.required && (
                  <p className="info-value" key={type}>
                    {type === 'canteen' && '캔틴'}
                    {type === 'lounge' && '라운지'}
                    {type === 'breakRoom' && '휴게실'}
                    {type === 'storage' && '창고'}
                    {type === 'exhibition' && '전시공간'}
                    {type === 'serverRoom' && '서버실'}
                    {type === 'other' && '기타'}
                    {data.size && ` (${data.size})`}
                  </p>
                )
              ))}
            </div>
          </div>
        </div>
        <div className="data-actions">
          <button className="back-button" onClick={handleGoBack}>
            이전으로 돌아가기
          </button>
          <button className="submit-button" onClick={handleSubmitData}>
            상담정보 제출하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignPreview; 