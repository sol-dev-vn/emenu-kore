## Brief overview
This rule provides guidelines for log management during development, specifically focusing on avoiding prolonged log watching or tailing operations.

## Log management practices
- Avoid tailing or watching logs for extended periods
- Use targeted log queries instead of continuous monitoring when possible
- Set up appropriate log filtering to focus on relevant information
- Consider using log aggregation tools for long-term monitoring needs
- Implement proper log rotation to prevent log files from becoming too large

## Development workflow
- Use logs for debugging specific issues rather than continuous monitoring
- When checking logs, focus on specific time ranges or error patterns
- Prefer structured logging that can be easily filtered and searched
- Set up alerts for critical issues instead of manually monitoring logs

## Performance considerations
- Long-running log tail operations can consume system resources
- Excessive log monitoring can slow down development workflow
- Consider the impact of log operations on system performance