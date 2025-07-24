/**
 * RiggerConnect Design System - JobCard Component
 * Shared job card component specification for all platforms
 * 
 * 🏗️ ChaseWhiteRabbit NGO Initiative
 */

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'annually';
  };
  type: 'full-time' | 'part-time' | 'contract' | 'temporary';
  level: 'entry' | 'mid' | 'senior' | 'lead';
  skills: string[];
  postedAt: Date;
  deadline?: Date;
  isUrgent?: boolean;
  isSaved?: boolean;
  hasApplied?: boolean;
  matchScore?: number; // 0-100
  distance?: number; // in kilometers
  description?: string;
  benefits?: string[];
  requirements?: string[];
}

export interface JobCardProps {
  job: Job;
  variant?: 'compact' | 'detailed' | 'featured';
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  onView?: (jobId: string) => void;
  showDistance?: boolean;
  showMatchScore?: boolean;
  showApplyButton?: boolean;
  showSaveButton?: boolean;
}

export interface JobCardStyles {
  container: {
    padding: string;
    margin: string;
    borderRadius: string;
    backgroundColor: string;
    borderWidth: string;
    borderColor: string;
    elevation?: number; // Android
    shadowOffset?: { width: number; height: number }; // iOS
    shadowOpacity?: number; // iOS
    shadowRadius?: number; // iOS
  };
  header: {
    marginBottom: string;
  };
  title: {
    fontSize: string;
    fontWeight: string;
    color: string;
    lineHeight: string;
  };
  company: {
    fontSize: string;
    fontWeight: string;
    color: string;
    marginTop: string;
  };
  location: {
    fontSize: string;
    color: string;
    marginTop: string;
  };
  salary: {
    fontSize: string;
    fontWeight: string;
    color: string;
    marginTop: string;
  };
  badges: {
    flexDirection: 'row';
    flexWrap: 'wrap';
    marginTop: string;
    gap: string;
  };
  badge: {
    paddingHorizontal: string;
    paddingVertical: string;
    borderRadius: string;
    backgroundColor: string;
    marginRight: string;
    marginBottom: string;
  };
  badgeText: {
    fontSize: string;
    fontWeight: string;
    color: string;
  };
  footer: {
    flexDirection: 'row';
    justifyContent: 'space-between';
    alignItems: 'center';
    marginTop: string;
  };
  actions: {
    flexDirection: 'row';
    gap: string;
  };
  button: {
    paddingHorizontal: string;
    paddingVertical: string;
    borderRadius: string;
    backgroundColor: string;
    borderWidth: string;
    borderColor: string;
  };
  buttonText: {
    fontSize: string;
    fontWeight: string;
    color: string;
    textAlign: 'center';
  };
  metadata: {
    flexDirection: 'row';
    alignItems: 'center';
    gap: string;
  };
  metadataText: {
    fontSize: string;
    color: string;
  };
}

// Platform-specific implementations

// React/TypeScript (Capacitor & Web)
export const JobCardReact = `
import React from 'react';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

export const JobCard: React.FC<JobCardProps> = ({
  job,
  variant = 'compact',
  onApply,
  onSave,
  onView,
  showDistance = true,
  showMatchScore = true,
  showApplyButton = true,
  showSaveButton = true,
}) => {
  const styles = getJobCardStyles(variant);
  
  const handleApply = () => {
    onApply?.(job.id);
  };
  
  const handleSave = () => {
    onSave?.(job.id);
  };
  
  const handleView = () => {
    onView?.(job.id);
  };
  
  return (
    <div className="job-card" style={styles.container} onClick={handleView}>
      <div style={styles.header}>
        <h3 style={styles.title}>{job.title}</h3>
        <p style={styles.company}>{job.company}</p>
        <p style={styles.location}>{job.location}</p>
        <p style={styles.salary}>
          {job.salary.currency}{job.salary.min.toLocaleString()}-{job.salary.max.toLocaleString()} / {job.salary.period}
        </p>
      </div>
      
      <div style={styles.badges}>
        <span style={styles.badge}>
          <span style={styles.badgeText}>{job.type}</span>
        </span>
        <span style={styles.badge}>
          <span style={styles.badgeText}>{job.level}</span>
        </span>
        {job.isUrgent && (
          <span style={{...styles.badge, backgroundColor: colors.status.error}}>
            <span style={styles.badgeText}>Urgent</span>
          </span>
        )}
      </div>
      
      <div style={styles.footer}>
        <div style={styles.metadata}>
          {showDistance && job.distance && (
            <span style={styles.metadataText}>{job.distance}km away</span>
          )}
          {showMatchScore && job.matchScore && (
            <span style={styles.metadataText}>{job.matchScore}% match</span>
          )}
          <span style={styles.metadataText}>
            {formatTimeAgo(job.postedAt)}
          </span>
        </div>
        
        <div style={styles.actions}>
          {showSaveButton && (
            <button
              style={styles.button}
              onClick={(e) => { e.stopPropagation(); handleSave(); }}
            >
              <span style={styles.buttonText}>
                {job.isSaved ? 'Saved' : 'Save'}
              </span>
            </button>
          )}
          {showApplyButton && !job.hasApplied && (
            <button
              style={{...styles.button, backgroundColor: colors.primary.cyan}}
              onClick={(e) => { e.stopPropagation(); handleApply(); }}
            >
              <span style={styles.buttonText}>Apply</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return \`\${days} days ago\`;
  if (days < 30) return \`\${Math.floor(days / 7)} weeks ago\`;
  return \`\${Math.floor(days / 30)} months ago\`;
}

function getJobCardStyles(variant: string): JobCardStyles {
  const baseStyles: JobCardStyles = {
    container: {
      padding: spacing.md,
      margin: spacing.sm,
      borderRadius: '12px',
      backgroundColor: colors.background.surface,
      borderWidth: '1px',
      borderColor: colors.border.primary,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    // ... rest of styles
  };
  
  return baseStyles;
}
`;

// Kotlin (Android Jetpack Compose)
export const JobCardAndroid = `
@Composable
fun JobCard(
    job: Job,
    variant: JobCardVariant = JobCardVariant.Compact,
    onApply: ((String) -> Unit)? = null,
    onSave: ((String) -> Unit)? = null,
    onView: ((String) -> Unit)? = null,
    showDistance: Boolean = true,
    showMatchScore: Boolean = true,
    showApplyButton: Boolean = true,
    showSaveButton: Boolean = true,
    modifier: Modifier = Modifier
) {
    val tokens = LocalDesignTokens.current
    
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(tokens.spacing.sm.dp)
            .clickable { onView?.invoke(job.id) },
        colors = CardDefaults.cardColors(
            containerColor = Color(parseColor(tokens.colors.background.surface))
        ),
        border = BorderStroke(
            width = 1.dp,
            color = Color(parseColor(tokens.colors.border.primary))
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            modifier = Modifier.padding(tokens.spacing.md.dp)
        ) {
            // Header
            Column {
                Text(
                    text = job.title,
                    style = MaterialTheme.typography.titleMedium,
                    color = Color(parseColor(tokens.colors.text.primary)),
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = job.company,
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color(parseColor(tokens.colors.text.secondary)),
                    modifier = Modifier.padding(top = 4.dp)
                )
                Text(
                    text = job.location,
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(parseColor(tokens.colors.text.secondary)),
                    modifier = Modifier.padding(top = 2.dp)
                )
                Text(
                    text = "$\${job.salary.min.toLocaleString()}-\${job.salary.max.toLocaleString()} / \${job.salary.period}",
                    style = MaterialTheme.typography.titleSmall,
                    color = Color(parseColor(tokens.colors.primary.cyan)),
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }
            
            // Badges
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.padding(vertical = 8.dp)
            ) {
                item {
                    JobBadge(text = job.type, tokens = tokens)
                }
                item {
                    JobBadge(text = job.level, tokens = tokens)
                }
                if (job.isUrgent == true) {
                    item {
                        JobBadge(
                            text = "Urgent",
                            backgroundColor = tokens.colors.status.error,
                            tokens = tokens
                        )
                    }
                }
            }
            
            // Footer
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Metadata
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (showDistance && job.distance != null) {
                        Text(
                            text = "\${job.distance}km away",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color(parseColor(tokens.colors.text.secondary))
                        )
                    }
                    if (showMatchScore && job.matchScore != null) {
                        Text(
                            text = "\${job.matchScore}% match",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color(parseColor(tokens.colors.semantic.skill))
                        )
                    }
                    Text(
                        text = formatTimeAgo(job.postedAt),
                        style = MaterialTheme.typography.bodySmall,
                        color = Color(parseColor(tokens.colors.text.secondary))
                    )
                }
                
                // Actions
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (showSaveButton) {
                        OutlinedButton(
                            onClick = { onSave?.invoke(job.id) },
                            colors = ButtonDefaults.outlinedButtonColors(
                                contentColor = Color(parseColor(tokens.colors.text.primary))
                            )
                        ) {
                            Text(if (job.isSaved == true) "Saved" else "Save")
                        }
                    }
                    if (showApplyButton && job.hasApplied != true) {
                        Button(
                            onClick = { onApply?.invoke(job.id) },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(parseColor(tokens.colors.primary.cyan))
                            )
                        ) {
                            Text("Apply", color = Color(parseColor(tokens.colors.text.inverse)))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun JobBadge(
    text: String,
    backgroundColor: String = LocalDesignTokens.current.colors.background.elevated,
    tokens: DesignTokens
) {
    Surface(
        color = Color(parseColor(backgroundColor)),
        shape = RoundedCornerShape(16.dp),
        border = BorderStroke(1.dp, Color(parseColor(tokens.colors.border.secondary)))
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall,
            color = Color(parseColor(tokens.colors.text.primary)),
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}
`;

// Swift (iOS SwiftUI)
export const JobCardiOS = `
struct JobCard: View {
    let job: Job
    let variant: JobCardVariant
    let onApply: ((String) -> Void)?
    let onSave: ((String) -> Void)?
    let onView: ((String) -> Void)?
    let showDistance: Bool
    let showMatchScore: Bool
    let showApplyButton: Bool
    let showSaveButton: Bool
    
    @Environment(\\.designTokens) var tokens
    
    init(
        job: Job,
        variant: JobCardVariant = .compact,
        onApply: ((String) -> Void)? = nil,
        onSave: ((String) -> Void)? = nil,
        onView: ((String) -> Void)? = nil,
        showDistance: Bool = true,
        showMatchScore: Bool = true,
        showApplyButton: Bool = true,
        showSaveButton: Bool = true
    ) {
        self.job = job
        self.variant = variant
        self.onApply = onApply
        self.onSave = onSave
        self.onView = onView
        self.showDistance = showDistance
        self.showMatchScore = showMatchScore
        self.showApplyButton = showApplyButton
        self.showSaveButton = showSaveButton
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            VStack(alignment: .leading, spacing: 4) {
                Text(job.title)
                    .font(.headline)
                    .fontWeight(.bold)
                    .foregroundColor(Color(hex: tokens.colors.text.primary))
                
                Text(job.company)
                    .font(.subheadline)
                    .foregroundColor(Color(hex: tokens.colors.text.secondary))
                
                Text(job.location)
                    .font(.caption)
                    .foregroundColor(Color(hex: tokens.colors.text.secondary))
                
                Text("$\\(job.salary.min.formatted())-\\(job.salary.max.formatted()) / \\(job.salary.period)")
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(Color(hex: tokens.colors.primary.cyan))
            }
            
            // Badges
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    JobBadge(text: job.type, tokens: tokens)
                    JobBadge(text: job.level, tokens: tokens)
                    
                    if job.isUrgent == true {
                        JobBadge(
                            text: "Urgent",
                            backgroundColor: tokens.colors.status.error,
                            tokens: tokens
                        )
                    }
                }
                .padding(.horizontal, 1)
            }
            
            // Footer
            HStack {
                // Metadata
                HStack(spacing: 8) {
                    if showDistance, let distance = job.distance {
                        Text("\\(distance)km away")
                            .font(.caption2)
                            .foregroundColor(Color(hex: tokens.colors.text.secondary))
                    }
                    
                    if showMatchScore, let matchScore = job.matchScore {
                        Text("\\(matchScore)% match")
                            .font(.caption2)
                            .foregroundColor(Color(hex: tokens.colors.semantic.skill))
                    }
                    
                    Text(job.postedAt.timeAgoDisplay())
                        .font(.caption2)
                        .foregroundColor(Color(hex: tokens.colors.text.secondary))
                }
                
                Spacer()
                
                // Actions
                HStack(spacing: 8) {
                    if showSaveButton {
                        Button(job.isSaved == true ? "Saved" : "Save") {
                            onSave?(job.id)
                        }
                        .buttonStyle(SecondaryButtonStyle(tokens: tokens))
                    }
                    
                    if showApplyButton && job.hasApplied != true {
                        Button("Apply") {
                            onApply?(job.id)
                        }
                        .buttonStyle(PrimaryButtonStyle(tokens: tokens))
                    }
                }
            }
        }
        .padding(16)
        .background(Color(hex: tokens.colors.background.surface))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color(hex: tokens.colors.border.primary), lineWidth: 1)
        )
        .contentShape(Rectangle())
        .onTapGesture {
            onView?(job.id)
        }
    }
}

struct JobBadge: View {
    let text: String
    let backgroundColor: String
    let tokens: DesignTokens
    
    init(text: String, backgroundColor: String? = nil, tokens: DesignTokens) {
        self.text = text
        self.backgroundColor = backgroundColor ?? tokens.colors.background.elevated
        self.tokens = tokens
    }
    
    var body: some View {
        Text(text)
            .font(.caption2)
            .fontWeight(.medium)
            .foregroundColor(Color(hex: tokens.colors.text.primary))
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(Color(hex: backgroundColor))
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color(hex: tokens.colors.border.secondary), lineWidth: 1)
            )
    }
}
`;

export { JobCardReact, JobCardAndroid, JobCardiOS };
