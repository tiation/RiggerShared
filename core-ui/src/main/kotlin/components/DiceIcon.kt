package com.chasewhiterabbit.rigger.core.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.unit.dp

@Composable
fun DiceIcon(
    value: Int,
    modifier: Modifier = Modifier,
    size: Int = 24
) {
    require(value in 1..6) { "Dice value must be between 1 and 6" }
    
    val colorScheme = MaterialTheme.colorScheme
    
    Canvas(
        modifier = modifier.size(size.dp)
    ) {
        // Draw dice body
        drawRoundRect(
            color = colorScheme.surfaceVariant,
            cornerRadius = CornerRadius(4.dp.toPx()),
            style = Fill
        )
        
        val dotColor = colorScheme.onSurfaceVariant
        val dotRadius = 2.dp.toPx()
        
        // Define dot positions based on dice value
        val dots = when (value) {
            1 -> listOf(Offset(size/2f, size/2f))
            2 -> listOf(
                Offset(size/3f, size/3f),
                Offset(2*size/3f, 2*size/3f)
            )
            3 -> listOf(
                Offset(size/3f, size/3f),
                Offset(size/2f, size/2f),
                Offset(2*size/3f, 2*size/3f)
            )
            4 -> listOf(
                Offset(size/3f, size/3f),
                Offset(2*size/3f, size/3f),
                Offset(size/3f, 2*size/3f),
                Offset(2*size/3f, 2*size/3f)
            )
            5 -> listOf(
                Offset(size/3f, size/3f),
                Offset(2*size/3f, size/3f),
                Offset(size/2f, size/2f),
                Offset(size/3f, 2*size/3f),
                Offset(2*size/3f, 2*size/3f)
            )
            6 -> listOf(
                Offset(size/3f, size/4f),
                Offset(2*size/3f, size/4f),
                Offset(size/3f, size/2f),
                Offset(2*size/3f, size/2f),
                Offset(size/3f, 3*size/4f),
                Offset(2*size/3f, 3*size/4f)
            )
            else -> emptyList()
        }
        
        // Draw dots
        dots.forEach { offset ->
            drawCircle(
                color = dotColor,
                radius = dotRadius,
                center = offset
            )
        }
    }
}
