import emailjs from '@emailjs/browser';

// 이메일 전송 서비스
const EMAIL_SERVICE_ID = 'service_officemmphase2';
const EMAIL_TEMPLATE_ID = 'template_i0oey2n';
const EMAIL_USER_ID = 'YiZScPmNjcBDnC8nm';

const generateCSV = (data) => {
  const rows = [
    ['구분', '항목', '내용'],
    ['기본 정보', '회사명', data?.company_name || ''],
    ['', '담당자', data?.contact_name || ''],
    ['', '연락처', data?.contact_phone || ''],
    ['', '이메일', data?.from_email || ''],
    ['규모 및 예산 범위', '공간 크기', data?.space_size || ''],
    ['', '총 인원', data?.total_employees || ''],
    ['', '예산 범위', data?.budget || ''],
    ['', '시작 일정', data?.start_schedule ? data.start_schedule : '미정'],
    ['', '완료 일정', data?.end_schedule ? data.end_schedule : '미정'],
    ['업무 공간 설정', '업무 형태', Array.isArray(data?.work_style) ? data.work_style.map(id => getWorkStyleLabel(id, data)).join(', ') : (data?.work_style || '')],
    ['', '좌석제도', data?.seating_type || ''],
    ['', '업무 공간 유연성', data?.work_style_flexibility || ''],
    ['개인 업무공간', '워크스테이션', data?.workstations || '0개'],
    ['', '개인 락커', data?.lockers || '0개'],
    ['', '1인 포커스룸', data?.focus_rooms_single || '0개'],
    ['', '2인 포커스룸', data?.focus_rooms_double || '0개'],
    ['', '임원실(사무실)', data?.executive_rooms || '0개'],
    ['회의실', '소형 회의실(4인)', data?.meeting_rooms_small || '0개'],
    ['', '중형 회의실(6인)', data?.meeting_rooms_medium || '0개'],
    ['', '대형 회의실(8인)', data?.meeting_rooms_large || '0개'],
    ['', '컨퍼런스룸(9인 이상)', data?.meeting_rooms_conference || '0개']
  ];

  // 추가 공간 정보가 있는 경우에만 추가
  if (data?.additional_spaces) {
    const additionalSpaces = data.additional_spaces.split('\n');
    additionalSpaces.forEach(space => {
      if (space.trim()) {
        rows.push(['추가 공간', space.replace('- ', ''), '']);
      }
    });
  }

  // CSV 문자열 생성
  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
};

export const sendOfficeDataEmail = async (formData) => {
  try {
    // CSV 내용 생성
    const csvContent = generateCSV(formData);

    // 파일명 생성
    const fileName = `${formData?.company_name?.replace(/[^a-zA-Z0-9가-힣]/g, '_') || 'office_data'}_오피스_설계_데이터_${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '-').replace('.', '')}.csv`;

    const templateParams = {
      company_name: formData?.company_name || '',
      contact_name: formData?.contact_name || '',
      contact_phone: formData?.contact_phone || '',
      from_email: formData?.from_email || '',
      office_size: formData?.space_size || '',
      employee_count: formData?.total_employees || '',
      office_budget: formData?.budget || '',
      start_schedule: formData?.start_schedule ? formData.start_schedule : '미정',
      end_schedule: formData?.end_schedule ? formData.end_schedule : '미정',
      seating_type: formData?.seating_type || '',
      work_style: Array.isArray(formData?.work_style) ? formData.work_style.map(id => getWorkStyleLabel(id, formData)).join(', ') : (formData?.work_style || ''),
      work_style_flexibility: formData?.work_style_flexibility || '',
      workstations: formData?.workstations || '0개',
      lockers: formData?.lockers || '0개',
      focus_rooms_single: formData?.focus_rooms_single || '0개',
      focus_rooms_double: formData?.focus_rooms_double || '0개',
      executive_rooms: formData?.executive_rooms || '0개',
      meeting_rooms_small: formData?.meeting_rooms_small || '0개',
      meeting_rooms_medium: formData?.meeting_rooms_medium || '0개',
      meeting_rooms_large: formData?.meeting_rooms_large || '0개',
      meeting_rooms_conference: formData?.meeting_rooms_conference || '0개',
      additional_spaces: formData?.additional_spaces || '',
      csv_content: csvContent,
      csv_file_name: fileName,
      attachment_section: `📎 첨부 파일:\n\n${csvContent}`
    };

    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      templateParams,
      EMAIL_USER_ID
    );

    if (response.text !== 'OK') {
      throw new Error('이메일 전송에 실패했습니다.');
    }

    return true;
  } catch (error) {
    console.error('이메일 전송 중 오류 발생:', error);
    throw new Error(error.message || '이메일 전송 중 오류가 발생했습니다.');
  }
};

const formatEmailContent = (data) => {
  const workStyleMap = {
    'startup': '스타트업',
    'finance': '재무/금융',
    'tech': 'IT/기술',
    'creative': '크리에이티브',
    'consulting': '컨설팅',
    'research': '연구/개발',
    'marketing': '마케팅',
    'general': '일반 사무',
    'other': data?.workStyleOther || '기타'
  };

  const flexibilityMap = {
    'high': '매우 유연',
    'medium': '중간',
    'low': '제한적'
  };

  const additionalSpaces = Object.entries(data.additionalSpaces)
    .filter(([_, space]) => space.required)
    .map(([type, space]) => {
      const spaceName = {
        'canteen': '캔틴',
        'lounge': '라운지',
        'breakRoom': '휴게실',
        'storage': '창고',
        'exhibition': '전시공간',
        'serverRoom': '서버실',
        'other': '기타'
      }[type];
      return `${spaceName}${space.size ? ` (${space.size})` : ''}`;
    })
    .join('\n');

  return `
[기본 정보]
회사명: ${data.companyName}
담당자: ${data.contactName}
연락처: ${data.contactPhone}
공간 크기: ${data.spaceSize}평
총 인원: ${data.totalEmployees}명
예산 범위: ${data.budget}
좌석제도: ${data.seatingType === 'fixed' ? '고정좌석제' : '자율좌석제'}
업무 형태: ${Array.isArray(data.workStyle) ? data.workStyle.map(id => workStyleMap[id]).filter(Boolean).join(', ') : workStyleMap[data.workStyle]}
업무 공간 유연성: ${flexibilityMap[data.workStyleFlexibility]}
시작 일정: ${data.startSchedule || data.start_schedule || '미정'}
완료 일정: ${data.endSchedule || data.end_schedule || '미정'}

[개인 업무공간]
워크스테이션: ${data.workstations.count}개 (${data.workstations.size}cm)
개인 락커: ${data.lockers.count}개
1인 포커스룸: ${data.focusRooms.single.count}개
2인 포커스룸: ${data.focusRooms.double.count}개
임원실(사무실): ${data.executiveRooms.count}개

[회의실]
소형 회의실(4인): ${data.meetingRooms.small.count}개
중형 회의실(6인): ${data.meetingRooms.medium.count}개
대형 회의실(8인): ${data.meetingRooms.large.count}개
컨퍼런스룸(9인 이상): ${data.meetingRooms.conference.count}개

[추가 공간]
${additionalSpaces}
`;
};

const getWorkStyleLabel = (id, data) => ({
  'startup': '스타트업',
  'finance': '재무/금융',
  'tech': 'IT/기술',
  'creative': '크리에이티브',
  'consulting': '컨설팅',
  'research': '연구/개발',
  'marketing': '마케팅',
  'general': '일반 사무',
  'other': data?.workStyleOther || '기타'
}[id] || id); 